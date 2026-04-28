module Card::Golden
  extend ActiveSupport::Concern

  included do
    has_one :goldness, dependent: :destroy, class_name: "Card::Goldness"

    scope :golden, -> { joins(:goldness) }
    scope :with_golden_first, -> { left_outer_joins(:goldness).prepend_order("card_goldnesses.id IS NULL").preload(:goldness) }
  end

  def golden?
    goldness.present?
  end

  def gild
    create_goldness! unless golden?
  end

  def ungild
    goldness&.destroy
  end
end
