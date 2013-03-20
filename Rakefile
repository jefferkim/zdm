require 'sprockets'
require 'fileutils'
require 'uglifier'

app_name = 'muzhi'

desc 'Concatenate and minify javascript files'
task :js do
  app_js = "js/#{app_name}.js"
  return unless File.exists? app_js

  environment = Sprockets::Environment.new
  environment.append_path 'js'

  puts "-> ./#{app_name}.js"
  File.open "#{app_name}.js", 'w' do |f|
    f.write environment["#{app_name}.js"].to_s
  end

  puts "-> ./#{app_name}.min.js"
  environment.js_compressor  = Uglifier.new
  File.open "#{app_name}.min.js", 'w' do |f|
    f.write environment["#{app_name}.js"].to_s
  end
end