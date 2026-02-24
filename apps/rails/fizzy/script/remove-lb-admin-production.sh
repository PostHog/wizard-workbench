#!/usr/bin/env bash

set -e

ssh app@fizzy-lb-101.df-iad-int.37signals.com \
  docker exec fizzy-load-balancer kamal-proxy rm fizzy-admin

ssh app@fizzy-lb-01.sc-chi-int.37signals.com \
  docker exec fizzy-load-balancer kamal-proxy rm fizzy-admin

ssh app@fizzy-lb-401.df-ams-int.37signals.com \
  docker exec fizzy-load-balancer kamal-proxy rm fizzy-admin
