module User::DayTimeline::Serializable
  extend ActiveSupport::Concern

  included do
    include GlobalID::Identification # For active job serialization
    alias id to_json
  end

  class_methods do
    def find(id)
      data = JSON.parse(id).with_indifferent_access
      user = User.find(data[:user_id])
      day = Time.zone.parse(data[:day])
      filter = user.filters.from_params data[:filter_params]

      new(user, day, filter)
    end

    def tenanted?
      # TODO: Check with Mike
      false
    end
  end

  def as_json(options = {})
    { user_id: user.id, day: day.to_s, filter_params: filter.as_params }
  end
end
