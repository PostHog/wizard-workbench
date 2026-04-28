require "test_helper"

class Columns::Cards::Drops::ColumnsControllerTest < ActionDispatch::IntegrationTest
  setup do
    sign_in_as :kevin
  end

  test "create" do
    card = cards(:logo)
    column = columns(:writebook_in_progress)

    assert_changes -> { card.reload.column }, to: column do
      post columns_card_drops_column_path(card, column_id: column.id), as: :turbo_stream
      assert_response :success
    end
  end
end
