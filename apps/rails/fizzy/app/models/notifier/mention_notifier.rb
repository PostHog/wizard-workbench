class Notifier::MentionNotifier < Notifier
  alias mention source

  private
    def recipients
      if mention.self_mention?
        []
      else
        [ mention.mentionee ]
      end
    end

    def creator
      mention.mentioner
    end
end
