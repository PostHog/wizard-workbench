class ChangeUsageLimitToBigintInAccountJoinCodes < ActiveRecord::Migration[8.2]
  def change
    change_column :account_join_codes, :usage_count, :bigint
    change_column :account_join_codes, :usage_limit, :bigint
  end
end
