require "test_helper"

class Cards::PreviewsControllerTest < ActionDispatch::IntegrationTest
  setup do
    sign_in_as :kevin
  end

  test "index" do
    get cards_previews_path(format: :turbo_stream)

    assert_response :success
  end
end
