require "test_helper"

class HotkeysHelperTest < ActionView::TestCase
  include SetPlatform

  test "mac modifier key" do
    emulate_mac

    assert_equal "⌘J", hotkey_label([ "⌘", "J" ])
  end

  test "linux modifier key" do
    emulate_linux

    assert_equal "Ctrl+J", hotkey_label([ "ctrl", "J" ])
  end

  test "mac enter" do
    emulate_mac

    assert_equal "Return+J", hotkey_label([ "enter", "J" ])
  end

  test "linux enter" do
    emulate_linux

    assert_equal "Enter+J", hotkey_label([ "enter", "J" ])
  end

  test "mac hyper" do
    emulate_mac

    assert_equal "Hyper+J", hotkey_label([ "hyper", "J" ])
  end

  test "linux hyper" do
    emulate_linux

    assert_equal "Hyper+J", hotkey_label([ "hyper", "J" ])
  end

  private
    def emulate_mac
      stub_platform = ApplicationPlatform.new("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36")
      self.stubs(:platform).returns(stub_platform)
    end

    def emulate_linux
      stub_platform = ApplicationPlatform.new("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36")
      self.stubs(:platform).returns(stub_platform)
    end
end
