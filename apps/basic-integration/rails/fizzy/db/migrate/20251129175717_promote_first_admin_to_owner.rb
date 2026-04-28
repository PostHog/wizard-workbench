class PromoteFirstAdminToOwner < ActiveRecord::Migration[8.2]
  def up
    Account.find_each do |account|
      next if account.users.exists?(role: :owner)

      first_admin = account.users.where(role: :admin).order(:created_at).first
      first_admin&.update!(role: :owner)
    end
  end

  def down
    User.where(role: :owner).update_all(role: :admin)
  end
end
