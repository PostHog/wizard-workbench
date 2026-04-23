require "test_helper"

class Search::HighlighterTest < ActiveSupport::TestCase
  test "highlight simple word match" do
    highlighter = Search::Highlighter.new("hello")
    result = highlighter.highlight("Hello world")

    assert_equal "#{mark('Hello')} world", result
  end

  test "highlight multiple occurrences" do
    highlighter = Search::Highlighter.new("test")
    result = highlighter.highlight("This is a test and another test")

    assert_equal "This is a #{mark('test')} and another #{mark('test')}", result
  end

  test "highlight case insensitive" do
    highlighter = Search::Highlighter.new("ruby")
    result = highlighter.highlight("Ruby is great and RUBY rocks")

    assert_equal "#{mark('Ruby')} is great and #{mark('RUBY')} rocks", result
  end

  test "highlight quoted phrases" do
    highlighter = Search::Highlighter.new('"hello world"')
    result = highlighter.highlight("Say hello world to everyone")

    assert_equal "Say #{mark('hello world')} to everyone", result
  end

  test "snippet returns full text with highlights when under max words" do
    highlighter = Search::Highlighter.new("ruby")
    result = highlighter.snippet("Ruby is great", max_words: 20)

    assert_equal "#{mark('Ruby')} is great", result
  end

  test "snippet creates excerpt around match" do
    highlighter = Search::Highlighter.new("match")
    text = "word " * 10 + "match " + "word " * 10
    result = highlighter.snippet(text, max_words: 10)

    assert result.start_with?("...")
    assert result.end_with?("...")
    assert_includes result, mark("match")
  end

  test "snippet adds leading ellipsis when match is not at start" do
    highlighter = Search::Highlighter.new("middle")
    text = "word " * 20 + "middle"
    result = highlighter.snippet(text, max_words: 10)

    assert result.start_with?("...")
    assert_not result.end_with?("...")
    assert_includes result, mark("middle")
  end

  test "snippet adds trailing ellipsis when text continues after excerpt" do
    highlighter = Search::Highlighter.new("start")
    text = "start " + "word " * 30
    result = highlighter.snippet(text, max_words: 10)

    assert result.end_with?("...")
    assert_not result.start_with?("...")
    assert_includes result, mark("start")
  end

  test "snippet falls back to truncation when no match found" do
    highlighter = Search::Highlighter.new("nomatch")
    text = "This text does not contain the search term " + "word " * 50
    result = highlighter.snippet(text, max_words: 10)

    assert_includes result, "..."
    assert_not_includes result, Search::Highlighter::OPENING_MARK
  end

  test "highlight escapes HTML and preserves marks" do
    highlighter = Search::Highlighter.new("test")
    result = highlighter.highlight("<script>test</script>")

    assert_equal "&lt;script&gt;#{mark('test')}&lt;/script&gt;", result
  end

  private
    def mark(text)
      "#{Search::Highlighter::OPENING_MARK}#{text}#{Search::Highlighter::CLOSING_MARK}"
    end
end
