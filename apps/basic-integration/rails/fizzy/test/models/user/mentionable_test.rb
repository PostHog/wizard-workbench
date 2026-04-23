require "test_helper"

class User::MentionableTest < ActiveSupport::TestCase
  test "mentionable handles" do
    assert_equal [ "dhh", "david", "davidh" ], User.new(name: "David Heinemeier-Hansson").mentionable_handles
  end

  test "mentioned by" do
    users(:david).mentions.destroy_all

    assert_difference -> { users(:david).mentions.count }, +1 do
      users(:david).mentioned_by users(:jz), at: cards(:logo)
    end

    # No dups
    assert_no_difference -> { users(:david).mentions.count }, +1 do
      users(:david).mentioned_by users(:jz), at: cards(:logo)
    end
  end
end
