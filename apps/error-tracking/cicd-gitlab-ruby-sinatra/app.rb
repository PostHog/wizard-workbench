require "json"
require "sinatra/base"
require_relative "lib/analytics"

class InventoryApp < Sinatra::Base
  ITEMS = { 1 => "hedgehog plush", 2 => "sticker pack" }.freeze

  get "/" do
    content_type :json
    { status: "ok" }.to_json
  end

  get "/items/:id" do
    id = Integer(params[:id])
    item = ITEMS.fetch(id)
    Analytics.capture(distinct_id: request.ip, event: "item viewed", properties: { item_id: id })
    content_type :json
    { id: id, name: item }.to_json
  end

  get "/boom" do
    raise "kaboom"
  end
end
