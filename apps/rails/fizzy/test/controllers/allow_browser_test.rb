require "test_helper"

class AllowBrowserTest < ActionDispatch::IntegrationTest
  test "Baidu browser is allowed" do
    sign_in_as :kevin

    get cards_path, headers: {
      "User-Agent" => "Mozilla/5.0 (Linux; Android 7.0; HUAWEI NXT-AL10 Build/HUAWEINXT-AL10; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/48.0.2564.116 Mobile Safari/537.36 baidubrowser/7.9.12.0 (Baidu; P1 7.0)NULL"
    }

    assert_response :success
  end

  test "nonsense user agent with bot in name is allowed" do
    sign_in_as :kevin

    get cards_path, headers: {
      "User-Agent" => "TotallyFakeBot/1.0 (NonsenseBrowser; Testing)"
    }

    assert_response :success
  end

  test "nonsense user agent is allowed" do
    sign_in_as :kevin

    get cards_path, headers: {
      "User-Agent" => "just some random nonsense text"
    }

    assert_response :success
  end

  test "old Chrome browser is rejected with 406" do
    sign_in_as :kevin

    # Chrome 118 is below the modern threshold of Chrome 120
    get cards_path, headers: {
      "User-Agent" => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118 Safari/537.36"
    }

    assert_response :not_acceptable
  end

  test "Google Image Proxy is allowed" do
    sign_in_as :kevin

    get cards_path, headers: {
      "User-Agent" => "Mozilla/5.0 (Windows NT 5.1; rv:11.0) Gecko Firefox/11.0 (via ggpht.com GoogleImageProxy)"
    }

    assert_response :success
  end

  test "Facebook/Twitter bot is allowed" do
    sign_in_as :kevin

    get cards_path, headers: {
      "User-Agent" => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/601.2.4 (KHTML, like Gecko) Version/9.0.1 Safari/601.2.4 facebookexternalhit/1.1 Facebot Twitterbot/1.0"
    }

    assert_response :success
  end
end
