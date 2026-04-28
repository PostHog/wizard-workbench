module ChoiceSentenceArrayConversion
  def to_choice_sentence
    to_sentence two_words_connector: " or ", last_word_connector: ", or "
  end
end

Array.include ChoiceSentenceArrayConversion
