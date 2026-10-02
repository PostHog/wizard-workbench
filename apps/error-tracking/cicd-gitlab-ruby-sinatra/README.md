# Inventory API

Sinatra service on Puma.

## Development

```bash
bundle install
bin/dev              # rackup on :4567, loads .env when present
bundle exec rake test
```

## Deployment

GitLab CI runs the tests on merge requests and on the default branch. On the
default branch the `deploy` job SSHes into the server, checks out the commit in
`/srv/inventory/current`, and restarts the `inventory` systemd unit
(`deploy/inventory.service`). The unit reads its environment from
`/srv/inventory/shared/inventory.env` (template: `deploy/inventory.env.example`).
