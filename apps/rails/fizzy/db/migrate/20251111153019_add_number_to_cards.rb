class AddNumberToCards < ActiveRecord::Migration[8.2]
  def change
    add_column :cards, :number, :bigint, null: false
    add_column :accounts, :cards_count, :bigint, default: 0, null: false
    add_index :cards, [:account_id, :number], unique: true
  end
end
