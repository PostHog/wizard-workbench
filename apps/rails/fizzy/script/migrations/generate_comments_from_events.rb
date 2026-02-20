#!/usr/bin/env ruby

require_relative "../config/environment"

ApplicationRecord.with_each_tenant do |tenant|
  Card.find_each do |card|
    card.events.find_each do |event|
      Card::Eventable::SystemCommenter.new(card.reload, event).comment
    end
  end
end
