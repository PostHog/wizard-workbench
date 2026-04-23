class AddSearchRecords < ActiveRecord::Migration[8.2]
  def up
    return unless connection.adapter_name == "SQLite"

    # Create regular table with integer primary key for FTS5 rowid compatibility
    create_table :search_records do |t|
      t.uuid :account_id, null: false
      t.string :searchable_type, limit: 255, null: false
      t.uuid :searchable_id, null: false
      t.uuid :card_id, null: false
      t.uuid :board_id, null: false
      t.string :title, limit: 255
      t.text :content
      t.datetime :created_at, null: false

      t.index [:searchable_type, :searchable_id], unique: true
      t.index :account_id
    end

    # Create FTS5 virtual table using Porter stemmer
    # No triggers needed - Searchable concern handles sync via callbacks
    execute <<-SQL
      CREATE VIRTUAL TABLE search_records_fts USING fts5(
        title,
        content,
        tokenize='porter'
      )
    SQL
  end

  def down
    return unless connection.adapter_name == "SQLite"

    execute "DROP TABLE IF EXISTS search_records_fts"
    drop_table :search_records, if_exists: true
  end
end
