require 'sinatra'
require 'rspotify'
require 'json'
require 'dotenv'
require 'omniauth'
require 'rspotify/oauth'

Dotenv.load

set :sessions, true
set :haml, format: :html5
set :public_folder, 'public'

RSpotify::authenticate(ENV['SPOTIFY_CLIENT_ID'], ENV['SPOTIFY_CLIENT_SECRET'])

use OmniAuth::Builder do
  provider :spotify, ENV['SPOTIFY_CLIENT_ID'], ENV['SPOTIFY_CLIENT_SECRET'], scope: 'playlist-modify-public playlist-modify-private'
end

get '/' do
  haml :index
end

get '/artist/search' do
  content_type :json

  artists = RSpotify::Artist.search(params['name'])
  artist = artists.first
  artist_hash = artist_to_artist_hash artist

  related_artists = artist.related_artists.map { |a| artist_to_artist_hash a }

  {
    artist: artist_hash,
    related_artists: related_artists
  }.to_json
end

get '/artist/find' do
  content_type :json

  artist = RSpotify::Artist.find(params['id'])
  artist_hash = artist_to_artist_hash artist

  related_artists = artist.related_artists.map { |a| artist_to_artist_hash a }

  {
    artist: artist_hash,
    related_artists: related_artists
  }.to_json
end

get '/auth/spotify/callback' do
  spotify_user = RSpotify::User.new(request.env['omniauth.auth'])
  session[:spotify_user] = spotify_user.to_hash
  redirect '/'
end

get '/logout' do
  session.clear
  redirect '/'
end

get '/make-playlist' do
  content_type :json

  artists = params[:artists].to_a.map { |a| a[1] }
  spotify_user = RSpotify::User.new(session[:spotify_user])

  tracks = artists.map { |a| RSpotify::Artist.find(a['id']).top_tracks(:US).first }

  title = "#{artists.first['name']} to #{artists.last['name']}"

  playlist = spotify_user.create_playlist! title
  playlist.add_tracks! tracks

  {
    url: playlist.external_urls['spotify'],
    title: title
  }.to_json
end

def artist_to_artist_hash artist
  {
    id: artist.id,
    name: artist.name,
    images: artist.images
  }
end
