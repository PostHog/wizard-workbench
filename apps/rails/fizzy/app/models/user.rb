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

  # Called by posthog-rails for automatic user association in error reports.
  # When auto_capture_exceptions and capture_user_context are enabled,
  # posthog-rails calls this method on current_user to get the distinct_id.
  def posthog_distinct_id
    identity&.email_address || id.to_s
  end

  # Helper used by controllers when calling PostHog.identify to set person properties.
  # These properties appear on the person profile in PostHog.
  def posthog_properties
    {
      email: identity&.email_address,
      name: name,
      account_id: account_id.to_s,
      role: role
    }
  end

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

  private
    def close_remote_connections
      ActionCable.server.remote_connections.where(current_user: self).disconnect(reconnect: false)
    end
end
