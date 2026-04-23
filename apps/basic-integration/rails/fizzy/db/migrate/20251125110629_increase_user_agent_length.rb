class IncreaseUserAgentLength < ActiveRecord::Migration[8.2]
  def change
    change_column :sessions, :user_agent, :string, limit: 4096
    change_column :push_subscriptions, :user_agent, :string, limit: 4096
  end
end
