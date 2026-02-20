#!/usr/bin/env ruby

require_relative "../config/environment"

ApplicationRecord.with_each_tenant do |tenant|
  User.find_each do |user|
    search_queries = Set.new
    to_delete = []
    user.search_queries.find_each do |search_query|
      if search_queries.include?(search_query.terms)
        to_delete << search_query
      end

      search_queries << search_query.terms
    end

    to_delete.each(&:destroy)
  end
end
