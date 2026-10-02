ENV["RACK_ENV"] = "test"

require "minitest/autorun"
require "rack/test"
require_relative "../app"

class AppTest < Minitest::Test
  include Rack::Test::Methods

  def app
    InventoryApp
  end

  def test_index
    get "/"
    assert_equal 200, last_response.status
  end

  def test_item
    get "/items/1"
    assert_equal "hedgehog plush", JSON.parse(last_response.body)["name"]
  end
end
