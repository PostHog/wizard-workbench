require_relative "../config/environment"
require "faker"

ACCOUNT = Account.find_by(name: "cleanslate")
CARDS_COUNT = ARGV.first&.to_i || 10_000
BOARDS_COUNT = ARGV.second&.to_i || 100
TAGS_COUNT = ARGV.third&.to_i || 500
USERS_COUNT = ARGV.fourth&.to_i || 1000

Current.account = ACCOUNT
Current.session = ACCOUNT.users.last.identity.sessions.first

puts "Creating #{CARDS_COUNT} cards with #{TAGS_COUNT} tags across #{BOARDS_COUNT} board(s)"

Board.suppressing_turbo_broadcasts do
  Card.suppressing_turbo_broadcasts do
    BOARDS_COUNT.times do
      ACCOUNT.boards.create! name: Faker::Company.buzzword, all_access: true
      print "."
    end

    CARDS_COUNT.times do
      card = ACCOUNT.boards.take.cards.create! \
        title: Faker::Company.bs, description: Faker::Hacker.say_something_smart, status: :published

      print "."
    end

    TAGS_COUNT.times do
      ACCOUNT.cards.take.toggle_tag_with Faker::Game.title
      print "."
    end

    USERS_COUNT.times do
      ACCOUNT.users.create! name: Faker::FunnyName
    end
  end
end
