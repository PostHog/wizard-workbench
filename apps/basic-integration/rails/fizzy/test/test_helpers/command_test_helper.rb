module CommandTestHelper
  def execute_command(string, user: users(:david))
    parse_command(string, user:).execute
  end

  def parse_command(string, user: users(:david))
    parser = Command::Parser.new(user: user, script_name: integration_session.default_url_options[:script_name])
    parser.parse(string)
  end
end
