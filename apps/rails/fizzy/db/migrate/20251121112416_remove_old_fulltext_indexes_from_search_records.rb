class RemoveOldFulltextIndexesFromSearchRecords < ActiveRecord::Migration[8.2]
  def up
    return if ActiveRecord::Base.connection.adapter_name == "SQLite"

    (0..15).each do |shard|
      remove_index "search_records_#{shard}", name: "index_search_records_#{shard}_on_content_and_title"
    end
  end

  def down
    return if ActiveRecord::Base.connection.adapter_name == "SQLite"

    (0..15).each do |shard|
      add_index "search_records_#{shard}", [ :content, :title ], type: :fulltext, name: "index_search_records_#{shard}_on_content_and_title"
    end
  end
end
