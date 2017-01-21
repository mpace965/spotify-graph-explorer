require 'sinatra'
require 'rspotify'
require 'json'
require 'dotenv'

Dotenv.load

set :haml, format: :html5
set :public_folder, 'public'

get '/' do
  haml :index
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
