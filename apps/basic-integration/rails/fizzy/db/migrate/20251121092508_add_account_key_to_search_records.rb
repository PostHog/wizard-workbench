class AddAccountKeyToSearchRecords < ActiveRecord::Migration[8.2]
  def up
    return if ActiveRecord::Base.connection.adapter_name == "SQLite"

    16.times do |shard_id|
      table_name = "search_records_#{shard_id}"

      add_column table_name, :account_key, :string, null: false, default: ""
      add_index table_name, [:account_key, :content, :title], type: :fulltext
    end
  end

  def down
    return if ActiveRecord::Base.connection.adapter_name == "SQLite"

    16.times do |shard_id|
      table_name = "search_records_#{shard_id}"

      remove_index table_name, column: [:account_key, :content, :title], type: :fulltext
      remove_column table_name, :account_key
    end
  end
end
