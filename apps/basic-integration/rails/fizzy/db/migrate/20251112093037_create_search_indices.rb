class CreateSearchIndices < ActiveRecord::Migration[8.2]
  def up
    # Skip for SQLite - it doesn't use these tables
    return if connection.adapter_name == "SQLite"

    16.times do |i|
      create_table "search_index_#{i}".to_sym, id: :uuid, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci" do |t|
        t.string :searchable_type, null: false
        t.uuid :searchable_id, null: false
        t.uuid :card_id, null: false
        t.uuid :board_id, null: false
        t.string :title
        t.text :content
        t.datetime :created_at, null: false

        t.index [:searchable_type, :searchable_id], unique: true, name: "idx_si#{i}_type_id"
        t.index [:content, :title], type: :fulltext, name: "idx_si#{i}_fulltext"
      end
    end
  end

  def down
    # Skip for SQLite - it doesn't use these tables
    return if connection.adapter_name == "SQLite"

    16.times do |i|
      drop_table "search_index_#{i}".to_sym
    end
  end
end
