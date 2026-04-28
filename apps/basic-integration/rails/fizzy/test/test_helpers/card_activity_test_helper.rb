module CardActivityTestHelper
  def multiple_people_comment_on(card, times: 4, people: users(:david, :kevin, :jz))
    perform_enqueued_jobs only: Card::ActivitySpike::DetectionJob do
      times.times do |index|
        creator = people[index % people.size]
        card.comments.create!(body: "Comment number #{index}", creator: creator)
        travel 1.second
      end
    end
  end
end
