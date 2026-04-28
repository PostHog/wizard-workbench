if defined?(Rack::MiniProfiler)
  Rack::MiniProfiler.config.tap do |config|
    config.position = "top-right"
    config.enable_hotwire_turbo_drive_support = true
    config.pre_authorize_cb = ->(_env) { !Rails.env.test? && File.exist?(Rails.root.join("tmp/rack-mini-profiler-dev.txt")) }
  end
end
