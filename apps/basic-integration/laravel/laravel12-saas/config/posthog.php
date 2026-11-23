<?php

return [
    'enabled' => env('POSTHOG_ENABLED', true),
    'capture_exceptions' => true,
    'api_key' => env('POSTHOG_API_KEY'),
    'host' => env('POSTHOG_HOST'),
];
