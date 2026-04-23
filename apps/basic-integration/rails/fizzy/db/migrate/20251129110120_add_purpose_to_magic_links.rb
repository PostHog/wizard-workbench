class AddPurposeToMagicLinks < ActiveRecord::Migration[8.2]
  def change
    add_column :magic_links, :purpose, :integer, null: true

    execute <<-SQL
      UPDATE magic_links SET purpose = 0
    SQL

    change_column_null :magic_links, :purpose, false
  end
end
