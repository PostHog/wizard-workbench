#! /usr/bin/env ruby

require_relative "../config/environment"

def migrate(source_service_name, target_service_name)
  ApplicationRecord.with_each_tenant do |tenant|
    puts "\n## #{tenant}"
    report = { updated: 0, skipped: 0, errors: 0 }

    if ActiveStorage::Blob.count == 0
      puts "No blobs found, skipping."
      next
    end

    ActiveStorage::Blob.service = source_service = ActiveStorage::Blob.services.fetch(source_service_name)
    target_service = ActiveStorage::Blob.services.fetch(target_service_name)

    ActiveStorage::Blob.find_each do |blob|
      if target_service.name.to_sym == blob.service_name.to_sym
        report[:skipped] += 1
        putc "-"
      elsif target_service.exist?(blob.key)
        report[:skipped] += 1
        putc "S"
      else
        begin
          blob.open do |stream|
            target_service.upload(blob.key, stream, checksum: blob.checksum)
          end
          report[:updated] += 1
          putc "."
        rescue ActiveStorage::FileNotFoundError
          report[:errors] += 1
          putc "E"
        end
      end

      # Update the service name of the blob.
      blob.update_column :service_name, target_service_name
    end

    puts
    pp report
  end
end

migrate :local, :purestorage
