<?php

return [
    'api_key' => env('POSTHOG_PROJECT_TOKEN', ''),
    'host' => env('POSTHOG_HOST', ''),
    'disabled' => env('POSTHOG_DISABLED', false),
];
