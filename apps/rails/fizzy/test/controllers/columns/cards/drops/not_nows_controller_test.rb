require "test_helper"

class Columns::Cards::Drops::NotNowsControllerTest < ActionDispatch::IntegrationTest
  setup do
    sign_in_as :kevin
  end

  test "create" do
    card = cards(:logo)

    assert_changes -> { card.reload.postponed? }, from: false, to: true do
      post columns_card_drops_not_now_path(card), as: :turbo_stream
      assert_response :success
    end
  end
end
