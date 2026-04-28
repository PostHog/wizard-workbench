# To include in those tests that use VCR. It will automatically insert a VCR cassette named after the test. By default,
# it will run the test in "replay" mode. To switch to record mode, you can either:
#
# * Set the environment variable +VCR_RECORD+.
# * Use +.vcr_record!+ in your test class.
module VcrTestHelper
  extend ActiveSupport::Concern

  included do
    class_attribute :vcr_record

    setup do
      @casette_name = "#{self.class.name.tableize.singularize}-#{name}"
      VCR.insert_cassette @casette_name,
        record: recording? ? :all : :none,
        preserve_exact_body_bytes: true
    end

    teardown do
      VCR.eject_cassette
    end

    def recording?
      vcr_record || ENV["VCR_RECORD"]
    end
  end

  class_methods do
    # Use to force record mode at development time: always perform real http interactions and record fixtures
    def vcr_record!
      raise "#vcr_record! is meant for dev time. You are not supposed to run it in CI." if ENV["CI"]

      self.vcr_record = true
    end
  end

  def without_vcr_body_matching(&block)
    VCR.use_cassette("#{@casette_name}_without_body", match_requests_on: [ :method, :uri ], &block)
  end
end
