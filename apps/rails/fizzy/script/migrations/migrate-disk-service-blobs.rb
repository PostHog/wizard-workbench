#! /usr/bin/env ruby

require_relative "../config/environment"

ApplicationRecord.with_each_tenant do |tenant|
  puts "\n## #{tenant}"
  report = { updated: 0, skipped: 0 }

  ActiveStorage::Blob.find_each do |blob|
    if blob.key.start_with?("#{tenant}/")
      report[:skipped] += 1
    else
      blob.update_column :key, "#{tenant}/#{blob.key}"
      report[:updated] += 1
    end
  end
  pp report

  disk_service = ActiveStorage::Blob.services.fetch(:local)
  new_root = File.join(disk_service.root, tenant)
  old_root = File.join("storage", "tenants", Rails.env, tenant, "files")

  FileUtils.mkdir_p(new_root, verbose: true) unless File.directory?(new_root)

  Dir.glob(File.join(old_root, "??")).each_slice(20) do |blob_dirs|
    FileUtils.mv(blob_dirs, new_root, verbose: true)
  end
end
