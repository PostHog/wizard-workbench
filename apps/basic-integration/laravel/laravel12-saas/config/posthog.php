<?php

return [
    'enabled' => env('POSTHOG_ENABLED', true),
    'api_key' => env('POSTHOG_API_KEY'),
    'host' => env('POSTHOG_HOST'),
    'capture_exceptions' => true,
    'header_context' => true,
    'queue_context' => true,
];
