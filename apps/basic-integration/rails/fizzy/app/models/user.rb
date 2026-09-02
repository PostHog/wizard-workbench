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

  def setup?
    name != identity.email_address
  end

  def verified?
    verified_at.present?
  end

  def verify
    update!(verified_at: Time.current) unless verified?
  end

  # Used by posthog-rails to associate automatic error reports with this user.
  # An identity can have a user record in multiple accounts, so use its stable
  # UUID to keep all of that person's activity on one PostHog profile.
  def posthog_distinct_id
    identity&.posthog_distinct_id || id.to_s
  end

  def posthog_properties
    {
      email: identity&.email_address,
      name: name
    }.compact
  end

  private
    def close_remote_connections
      ActionCable.server.remote_connections.where(current_user: self).disconnect(reconnect: false)
    end
end
