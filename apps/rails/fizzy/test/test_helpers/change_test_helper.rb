module ChangeTestHelper
  def capture_change(target)
    before = target.call
    yield
    after = target.call
    after - before
  end
end
