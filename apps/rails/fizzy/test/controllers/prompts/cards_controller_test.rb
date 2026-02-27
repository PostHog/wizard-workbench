require "test_helper"

class Prompts::CardsControllerTest < ActionDispatch::IntegrationTest
  setup do
    sign_in_as :kevin
  end

  test "index" do
    get prompts_cards_path
    assert_response :success
  end
end
