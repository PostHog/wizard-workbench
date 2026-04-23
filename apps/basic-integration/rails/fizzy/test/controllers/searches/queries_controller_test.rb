require "test_helper"

class Searches::QueriesControllerTest < ActionDispatch::IntegrationTest
  setup do
    sign_in_as :kevin
  end

  test "create" do
    assert_difference -> { users(:kevin).search_queries.count }, +1 do
      post searches_queries_path, params: { q: "layout issues" }
    end

    assert_equal "layout issues", users(:kevin).search_queries.last.terms
    assert_response :success
  end
end
