require 'sinatra'

set :haml, format: :html5
set :public_folder, 'public'

get '/' do
  haml :index
end
