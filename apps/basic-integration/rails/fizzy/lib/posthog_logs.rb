module PostHogLogs
  class << self
    attr_accessor :logger

    def info(message, attributes: {})
      logger&.on_emit(
        severity_text: "INFO",
        body: message,
        attributes: attributes
      )
    end
  end
end
