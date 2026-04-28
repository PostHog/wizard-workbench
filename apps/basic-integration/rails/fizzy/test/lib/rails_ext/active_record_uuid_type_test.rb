require "test_helper"

class ActiveRecordUuidTypeTest < ActiveSupport::TestCase
  setup do
    @type = ActiveRecord::Type::Uuid.new
    @sample_uuid = "01jcqzx8h0000000000000000" # base36 UUID
  end

  test "cast nil returns nil" do
    assert_nil @type.cast(nil)
  end

  test "cast returns value as-is" do
    result = @type.cast(@sample_uuid)
    assert_equal @sample_uuid, result
  end

  test "serialize returns binary Data object" do
    result = @type.serialize(@sample_uuid)

    assert_instance_of ActiveModel::Type::Binary::Data, result
    assert_equal 16, result.to_s.bytesize
    assert_equal Encoding::BINARY, result.to_s.encoding
  end

  test "serialize nil returns nil" do
    assert_nil @type.serialize(nil)
  end

  test "deserialize converts binary to base36" do
    binary_data = @type.serialize(@sample_uuid)

    result = @type.deserialize(binary_data)

    assert_equal @sample_uuid, result
  end

  test "deserialize handles raw binary string" do
    binary_data = @type.serialize(@sample_uuid)
    raw_binary = binary_data.to_s

    result = @type.deserialize(raw_binary)

    assert_equal @sample_uuid, result
  end

  test "deserialize nil returns nil" do
    assert_nil @type.deserialize(nil)
  end
end
