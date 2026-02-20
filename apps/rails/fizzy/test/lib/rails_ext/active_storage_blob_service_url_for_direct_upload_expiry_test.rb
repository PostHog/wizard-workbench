require "test_helper"

class ActiveStorageBlobServiceUrlForDirectUploadExpiryTest < ActiveSupport::TestCase
  setup do
    @blob = ActiveStorage::Blob.new(key: "test", filename: "test.txt", byte_size: 1024, checksum: "abc")
  end

  test "uses extended expiry by default" do
    @blob.service.expects(:url_for_direct_upload).with(@blob.key, expires_in: ActiveStorage.service_urls_for_direct_uploads_expire_in, content_type: @blob.content_type, content_length: @blob.byte_size, checksum: @blob.checksum, custom_metadata: {}).returns("https://example.com/upload")

    assert_equal "https://example.com/upload", @blob.service_url_for_direct_upload
  end

  test "service_urls_for_direct_uploads_expire_in is configurable" do
    original_expire_in = ActiveStorage.service_urls_for_direct_uploads_expire_in
    ActiveStorage.service_urls_for_direct_uploads_expire_in = 96.hours

    @blob.service.expects(:url_for_direct_upload).with(@blob.key, expires_in: 96.hours, content_type: @blob.content_type, content_length: @blob.byte_size, checksum: @blob.checksum, custom_metadata: {}).returns("https://example.com/upload")

    assert_equal "https://example.com/upload", @blob.service_url_for_direct_upload
  ensure
    ActiveStorage.service_urls_for_direct_uploads_expire_in = original_expire_in
  end
end
