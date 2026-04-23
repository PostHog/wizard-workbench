require "test_helper"

class QrCodeLinkTest < ActiveSupport::TestCase
  test "links can be signed and verified" do
    link = QrCodeLink.new "https://example.com"
    signed_link = link.signed

    verified = QrCodeLink.from_signed(signed_link)
    assert_equal link.url, verified.url
  end
end
