<?php

return [
    'api_key' => env('POSTHOG_KEY'),
    'host' => env('POSTHOG_HOST'),
    'disabled' => env('POSTHOG_DISABLED', false),
];
