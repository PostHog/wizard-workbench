require "test_helper"

class Users::JoinsControllerTest < ActionDispatch::IntegrationTest
  test "new" do
    sign_in_as :david

    get new_users_join_path
    assert_response :ok
  end

  test "create" do
    user = users(:david)
    sign_in_as user

    assert_no_difference -> { User.count } do
      post users_joins_path, params: { user: { name: "David Updated" } }
      assert_redirected_to landing_path
    end

    assert_equal "David Updated", user.reload.name
  end
end
