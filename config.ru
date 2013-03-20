require 'sprockets'

map '/' do
  environment = Sprockets::Environment.new
  environment.append_path 'js'
  run environment
end