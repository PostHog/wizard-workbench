class Prompts::UsersController < ApplicationController
  def index
    @users = Current.account.users.active.alphabetically

    if stale? etag: @users
      render layout: false
    end
  end
end
