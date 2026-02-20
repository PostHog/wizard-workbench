# Fix for SQLite FTS5 virtual table schema dumping
# Rails has a bug where it doesn't handle FTS5 content= and content_rowid= options

module SQLiteFTS5SchemaDumperFix
  # Override the virtual_tables method to handle FTS5 syntax properly
  def virtual_tables(stream)
    # Query sqlite_master for all virtual tables
    virtual_table_sqls = @connection.select_rows(
      "SELECT name, sql FROM sqlite_master WHERE type='table' AND sql LIKE 'CREATE VIRTUAL TABLE%'"
    )

    virtual_table_sqls.each do |table_name, sql|
      # Just output the raw SQL since create_virtual_table doesn't handle our syntax
      stream.puts "  execute #{sql.inspect}"
      stream.puts
    end
  end
end

ActiveSupport.on_load(:active_record_sqlite3adapter) do
  ActiveRecord::ConnectionAdapters::SQLite3::SchemaDumper.prepend(SQLiteFTS5SchemaDumperFix)
end
