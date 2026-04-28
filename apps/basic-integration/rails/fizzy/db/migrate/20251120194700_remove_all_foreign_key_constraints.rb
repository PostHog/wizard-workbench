class RemoveAllForeignKeyConstraints < ActiveRecord::Migration[8.2]
  def change
    remove_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id" rescue nil
    remove_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id" rescue nil
    remove_foreign_key "board_publications", "boards" rescue nil
    remove_foreign_key "card_activity_spikes", "cards" rescue nil
    remove_foreign_key "card_goldnesses", "cards" rescue nil
    remove_foreign_key "card_not_nows", "cards" rescue nil
    remove_foreign_key "card_not_nows", "users" rescue nil
    remove_foreign_key "cards", "columns" rescue nil
    remove_foreign_key "closures", "cards" rescue nil
    remove_foreign_key "closures", "users" rescue nil
    remove_foreign_key "columns", "boards" rescue nil
    remove_foreign_key "comments", "cards" rescue nil
    remove_foreign_key "events", "boards" rescue nil
    remove_foreign_key "magic_links", "identities" rescue nil
    remove_foreign_key "mentions", "users", column: "mentionee_id" rescue nil
    remove_foreign_key "mentions", "users", column: "mentioner_id" rescue nil
    remove_foreign_key "notification_bundles", "users" rescue nil
    remove_foreign_key "notifications", "users" rescue nil
    remove_foreign_key "notifications", "users", column: "creator_id" rescue nil
    remove_foreign_key "pins", "cards" rescue nil
    remove_foreign_key "pins", "users" rescue nil
    remove_foreign_key "push_subscriptions", "users" rescue nil
    remove_foreign_key "search_queries", "users" rescue nil
    remove_foreign_key "sessions", "identities" rescue nil
    remove_foreign_key "steps", "cards" rescue nil
    remove_foreign_key "taggings", "cards" rescue nil
    remove_foreign_key "taggings", "tags" rescue nil
    remove_foreign_key "user_settings", "users" rescue nil
    remove_foreign_key "users", "identities" rescue nil
    remove_foreign_key "watches", "cards" rescue nil
    remove_foreign_key "watches", "users" rescue nil
    remove_foreign_key "webhook_delinquency_trackers", "webhooks" rescue nil
    remove_foreign_key "webhook_deliveries", "events" rescue nil
    remove_foreign_key "webhook_deliveries", "webhooks" rescue nil
    remove_foreign_key "webhooks", "boards" rescue nil
  end
end
