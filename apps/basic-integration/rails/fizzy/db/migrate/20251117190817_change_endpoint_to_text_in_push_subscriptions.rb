class ChangeEndpointToTextInPushSubscriptions < ActiveRecord::Migration[8.2]
  def change
    # Remove foreign key first, then the index
    remove_foreign_key :push_subscriptions, :users
    remove_index :push_subscriptions, column: [:user_id, :endpoint]

    # Change the column type
    change_column :push_subscriptions, :endpoint, :text

    # Re-add the index and foreign key
    add_index :push_subscriptions, [:user_id, :endpoint], unique: true, length: { endpoint: 255 }
    add_foreign_key :push_subscriptions, :users
  end
end
