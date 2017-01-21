require 'sinatra'
require 'rspotify'
require 'json'

set :haml, format: :html5
set :public_folder, 'public'

get '/' do
  haml :index
end

get '/search' do
  content_type :json

  artists = RSpotify::Artist.search(params['artist'])

  artists.to_json
end
