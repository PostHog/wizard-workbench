class RemoveJoinCodeFromMemberships < ActiveRecord::Migration[8.2]
  def change
    remove_column :memberships, :join_code, :string
  end
end
