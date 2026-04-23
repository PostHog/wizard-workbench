require "test_helper"

class Webhook::DelinquencyTrackerTest < ActiveSupport::TestCase
  test "record_delivery_of" do
    tracker = webhook_delinquency_trackers(:active_webhook_tracker)
    webhook = tracker.webhook
    successful_delivery = webhook_deliveries(:successfully_completed)
    failed_delivery = webhook_deliveries(:errored)

    tracker.update!(consecutive_failures_count: 5)
    tracker.record_delivery_of(successful_delivery)
    tracker.reload

    assert_equal 0, tracker.consecutive_failures_count
    assert_nil tracker.first_failure_at

    assert_difference -> { tracker.reload.consecutive_failures_count }, +1 do
      tracker.record_delivery_of(failed_delivery)
    end

    tracker.reload
    assert_not_nil tracker.first_failure_at

    assert_difference -> { tracker.reload.consecutive_failures_count }, +1 do
      assert_no_difference -> { tracker.reload.first_failure_at } do
        tracker.record_delivery_of(failed_delivery)
      end
    end

    travel_to 2.hours.from_now do
      tracker.update!(consecutive_failures_count: 9)
      webhook.activate

      assert_changes -> { webhook.reload.active? }, from: true, to: false do
        tracker.record_delivery_of(failed_delivery)
      end
    end
  end
end
