require "test_helper"

class Prompts::TagsControllerTest < ActionDispatch::IntegrationTest
  setup do
    sign_in_as :kevin
  end

  test "index" do
    get prompts_tags_path
    assert_response :success
  end
end
