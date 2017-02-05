require 'dotenv'
require 'sinatra'
require 'omniauth'
require 'rspotify/oauth'

Dotenv.load

set :sessions, true
set :haml, format: :html5
set :public_folder, 'public'

use OmniAuth::Builder do
  provider :spotify, ENV['SPOTIFY_CLIENT_ID'], ENV['SPOTIFY_CLIENT_SECRET'], scope: 'playlist-modify-public playlist-modify-private'
end

use Rack::Deflater, if: (lambda do |env, status, headers, body|
  if body.respond_to? :filesize
    body.filesize > 512
  elsif body.is_a?(Array) && body.first.is_a?(String)
    body.map(&:bytesize).reduce(0, :+) > 512
  else
    true
  end
end)
