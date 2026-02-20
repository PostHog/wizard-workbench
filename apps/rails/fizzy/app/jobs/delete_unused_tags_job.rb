class DeleteUnusedTagsJob < ApplicationJob
  def perform
    Tag.unused.find_each do |tag|
      tag.destroy!
    end
  end
end
