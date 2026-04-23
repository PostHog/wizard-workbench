# frozen_string_literal: true

# Adds database-agnostic date arithmetic methods to ActiveRecord adapters.
# This allows code to perform date calculations without checking which database adapter is in use.
#
# Usage:
#   connection.date_subtract("created_at", "3600")
#   # MySQL/Trilogy: "DATE_SUB(created_at, INTERVAL 3600 SECOND)"
#   # SQLite: "datetime(created_at, '-' || (3600) || ' seconds')"

# Module for MySQL-based adapters (Trilogy, Mysql2, etc.)
module MysqlDateArithmetic
  # Generates SQL for subtracting seconds from a date/time column in MySQL.
  #
  # @param date_column [String] The date/time column or expression
  # @param seconds_expression [String] SQL expression that evaluates to number of seconds
  # @return [String] MySQL DATE_SUB expression
  #
  # Example:
  #   date_subtract("last_active_at", "COALESCE(auto_postpone_period, 3600)")
  #   # => "DATE_SUB(last_active_at, INTERVAL COALESCE(auto_postpone_period, 3600) SECOND)"
  def date_subtract(date_column, seconds_expression)
    "DATE_SUB(#{date_column}, INTERVAL #{seconds_expression} SECOND)"
  end
end

# Module for SQLite adapter
module SqliteDateArithmetic
  # Generates SQL for subtracting seconds from a date/time column in SQLite.
  #
  # @param date_column [String] The date/time column or expression
  # @param seconds_expression [String] SQL expression that evaluates to number of seconds
  # @return [String] SQLite datetime expression
  #
  # Example:
  #   date_subtract("last_active_at", "COALESCE(auto_postpone_period, 3600)")
  #   # => "datetime(last_active_at, '-' || (COALESCE(auto_postpone_period, 3600)) || ' seconds')"
  def date_subtract(date_column, seconds_expression)
    "datetime(#{date_column}, '-' || (#{seconds_expression}) || ' seconds')"
  end
end

ActiveSupport.on_load(:active_record) do
  # Prepend MySQL date arithmetic to AbstractMysqlAdapter (covers Trilogy, Mysql2, etc.)
  if defined?(ActiveRecord::ConnectionAdapters::AbstractMysqlAdapter)
    ActiveRecord::ConnectionAdapters::AbstractMysqlAdapter.prepend(MysqlDateArithmetic)
  end

  # Prepend SQLite date arithmetic to SQLite3Adapter
  if defined?(ActiveRecord::ConnectionAdapters::SQLite3Adapter)
    ActiveRecord::ConnectionAdapters::SQLite3Adapter.prepend(SqliteDateArithmetic)
  end
end
