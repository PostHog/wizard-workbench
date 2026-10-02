workers Integer(ENV.fetch("WEB_CONCURRENCY", 2))
threads 1, Integer(ENV.fetch("RAILS_MAX_THREADS", 5))
port Integer(ENV.fetch("PORT", 4567))
environment ENV.fetch("RACK_ENV", "development")
preload_app!
