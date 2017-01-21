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
  provider :spotify, ENV['SPOTIFY_CLIENT_ID'], ENV['SPOTIFY_CLIENT_SECRET'], scope: 'playlist-modify-public'
end

get '/' do
  haml :index
end

get '/auth/spotify/callback' do
  session[:spotify_user] = request.env['omniauth.auth']
  redirect '/'
end

get '/search' do
  content_type :json

  artists = RSpotify::Artist.search(params['artist'])
  artist = artists.first
  artist_hash = artist_to_artist_hash artist

  related_artists = artist.related_artists.map { |a| artist_to_artist_hash a }

  {
    artist: artist_hash,
    related_artists: related_artists
  }.to_json
end

def artist_to_artist_hash artist
  {
    id: artist.id,
    name: artist.name,
    images: artist.images
  }
end
