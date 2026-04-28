require "test_helper"

class DeleteUnusedTagsJobTest < ActiveJob::TestCase
  test "deletes tags that are not used by any cards" do
    unused = Tag.create!(title: "unused")

    assert_changes -> { Tag.count }, -1 do
      DeleteUnusedTagsJob.perform_now
    end

    assert_not Tag.exists?(unused.id), "Unused tag should be deleted"
  end
end
