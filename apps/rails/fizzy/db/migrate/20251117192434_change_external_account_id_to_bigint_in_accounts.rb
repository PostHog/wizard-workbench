class ChangeExternalAccountIdToBigintInAccounts < ActiveRecord::Migration[8.2]
  def change
    change_column :accounts, :external_account_id, :bigint
  end
end
