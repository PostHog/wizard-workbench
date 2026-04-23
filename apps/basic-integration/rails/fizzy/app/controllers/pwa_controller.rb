class PwaController < ApplicationController
  disallow_account_scope
  skip_forgery_protection

  # We need a stable URL at the root, so we can't use the regular asset path here.
  def service_worker
  end
end
