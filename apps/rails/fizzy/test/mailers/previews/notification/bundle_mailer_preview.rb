class Notification::BundleMailerPreview < ActionMailer::Preview
  def notification
    bundle = Notification::Bundle.all.sample
    Current.account = bundle.account
    Notification::BundleMailer.notification bundle
  end
end
