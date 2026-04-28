module Mailers::Unsubscribable
  extend ActiveSupport::Concern

  included do
    after_action :set_unsubscribe_headers
  end

  def set_unsubscribe_headers
    headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click"
    headers["List-Unsubscribe"]      = "<#{notifications_unsubscribe_url(access_token: @unsubscribe_token)}>"
  end
end
