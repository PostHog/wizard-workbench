require "test_helper"

class My::TimezonesControllerTest < ActionDispatch::IntegrationTest
  setup do
    sign_in_as :kevin
  end

  test "update" do
    time_zone = ActiveSupport::TimeZone["America/New_York"]

    assert_not_equal time_zone, users(:kevin).timezone
    patch my_timezone_path, params: { timezone_name: "America/New_York" }
    assert_equal time_zone, users(:kevin).reload.timezone
  end
end
