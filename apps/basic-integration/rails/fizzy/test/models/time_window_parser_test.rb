require "test_helper"

class TimeWindowParserTest < ActiveSupport::TestCase
  setup do
    @now = Time.zone.parse("2023-06-15 9am")
    @parser = TimeWindowParser.new(now: @now)
  end

  test "parse today" do
    assert_equal @now.beginning_of_day..@now.end_of_day,
      @parser.parse("today")
  end

  test "parse yesterday" do
    yesterday = @now - 1.day

    assert_equal yesterday.beginning_of_day..yesterday.end_of_day,
      @parser.parse("yesterday")
  end

  test "parse this week" do
    assert_equal @now.beginning_of_week..@now.end_of_week,
      @parser.parse("this week")
  end

  test "parse this month" do
    assert_equal @now.beginning_of_month..@now.end_of_month,
      @parser.parse("this month")
  end

  test "parse this year" do
    assert_equal @now.beginning_of_year..@now.end_of_year,
      @parser.parse("this year")
  end

  test "parse last week" do
    last_week = @now - 1.week

    assert_equal last_week.beginning_of_week..last_week.end_of_week,
      @parser.parse("last week")
  end

  test "parse last month" do
    last_month = @now - 1.month

    assert_equal last_month.beginning_of_month..last_month.end_of_month,
      @parser.parse("last month")
  end

  test "parse last year" do
    last_year = @now - 1.year

    assert_equal last_year.beginning_of_year..last_year.end_of_year,
      @parser.parse("last year")
  end

  test "parse with unknown string returns nil" do
    assert_nil @parser.parse("unknown time window")
  end

  test "returns nil for nil" do
    assert_nil @parser.parse(nil)
  end
end
