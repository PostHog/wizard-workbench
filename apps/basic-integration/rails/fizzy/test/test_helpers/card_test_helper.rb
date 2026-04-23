module CardTestHelper
  def assert_card_container_rerendered(card)
    assert_turbo_stream action: :replace, target: dom_id(card, :card_container)
  end
end
