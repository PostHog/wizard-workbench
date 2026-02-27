require "test_helper"

class TagTest < ActiveSupport::TestCase
  test "downcase title" do
    assert_equal "a tag", Tag.create!(title: "A TAG").title
  end

  test ".unused returns tags not associated with any cards" do
    unused = Tag.create!(title: "unused")

    unused_tags = Tag.unused

    assert_includes unused_tags, unused
    assert_not_includes unused_tags, tags(:web)
    assert_not_includes unused_tags, tags(:mobile)
  end

  test ".unused returns empty relation if all tags are used" do
    assert_empty Tag.unused
  end
end
