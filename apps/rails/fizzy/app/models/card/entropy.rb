class Card::Entropy
  attr_reader :card, :auto_clean_period

  class << self
    def for(card)
      return unless card.last_active_at

      new(card, card.auto_postpone_period)
    end
  end

  def initialize(card, auto_clean_period)
    @card = card
    @auto_clean_period = auto_clean_period
  end

  def auto_clean_at
    card.last_active_at + auto_clean_period
  end

  def days_before_reminder
    (auto_clean_period * 0.25).seconds.in_days.round
  end
end
