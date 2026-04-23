require "test_helper"

class Prompts::UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    sign_in_as :kevin
  end

  test "index" do
    get prompts_users_path
    assert_response :success
  end
end
