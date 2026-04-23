require "test_helper"

class User::NamedTest < ActiveSupport::TestCase
  test "initials" do
    assert_initials "M", name: "Michael"
    assert_initials "SD", name: "Salvador Dali"
    assert_initials "LMM", name: "Lin-Manuel Miranda"
    assert_initials "OCD", name: "O'Conor Díez"
    assert_initials "ACG", name: "Anne Christine García"
    assert_initials "ÁL", name: "Ángela López"
  end

  test "first name" do
    assert_first_name "Michael", "Michael"
    assert_first_name "Salvador", "Salvador Dali"
    assert_first_name "Lin-Manuel", "Lin-Manuel Miranda"
    assert_first_name "Anne", "Anne Christine García"
  end

  test "last name" do
    assert_last_name "Dali", "Salvador Dali"
    assert_last_name "Miranda", "Lin_Manuel Miranda"
    assert_last_name "Christine García", "Anne Christine García"
  end

  private
    def assert_initials(expected, **attributes)
      assert_equal expected, User.new(attributes).initials
    end

    def assert_first_name(expected, name)
      assert_equal expected, User.new(name: name).first_name
    end

    def assert_last_name(expected, name)
      assert_equal expected, User.new(name: name).last_name
    end
end
