class User < ApplicationRecord
  include Accessor, Assignee, Attachable, Avatar, Configurable, EmailAddressChangeable,
    Mentionable, Named, Notifiable, Role, Searcher, Watcher
  include Timelined # Depends on Accessor

  belongs_to :account
  belongs_to :identity, optional: true

  validates :name, presence: true

  has_many :comments, inverse_of: :creator, dependent: :destroy

  has_many :filters, foreign_key: :creator_id, inverse_of: :creator, dependent: :destroy
  has_many :closures, dependent: :nullify
  has_many :pins, dependent: :destroy
  has_many :pinned_cards, through: :pins, source: :card
  has_many :data_exports, class_name: "User::DataExport", dependent: :destroy

  def deactivate
    transaction do
      accesses.destroy_all
      update! active: false, identity: nil
      close_remote_connections
    end
  end

  # Used by posthog-rails to associate automatically captured exceptions with the user.
  # The stable database id avoids placing user-entered identity data in error events.
  def posthog_distinct_id
    id.to_s
  end

  # Sent only with identify calls, so mutable user-entered data stays on the
  # person profile instead of being repeated in event properties.
  def posthog_properties
    {
      email: identity&.email_address,
      name: name,
      account_id: account_id
    }.compact
  end

  def setup?
    name != identity.email_address
  end

  def verified?
    verified_at.present?
  end

  def verify
    update!(verified_at: Time.current) unless verified?
  end

  private
    def close_remote_connections
      ActionCable.server.remote_connections.where(current_user: self).disconnect(reconnect: false)
    end
end
