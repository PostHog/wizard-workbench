#
#  see https://github.com/basecamp/haystack/pull/7862
#
module ActiveStorage
  mattr_accessor :service_urls_for_direct_uploads_expire_in, default: 48.hours
end

module ActiveStorageBlobServiceUrlForDirectUploadExpiry
  # Override default expires_in to accommodate long upload URL expiry
  # without having to lengthen download URL expiry.
  #
  # Accounts for Cloudflare only proxying slow client uploads once they're
  # fully buffered, long after the URL expired.
  #
  # 48 hours covers a 10GB upload at 0.5Mbps.
  def service_url_for_direct_upload(expires_in: ActiveStorage.service_urls_for_direct_uploads_expire_in)
    super
  end
end

ActiveSupport.on_load :active_storage_blob do
  prepend ::ActiveStorageBlobServiceUrlForDirectUploadExpiry
end
