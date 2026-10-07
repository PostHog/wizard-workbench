<?php

return [
    'api_key' => env('POSTHOG_PROJECT_TOKEN'),
    'host' => env('POSTHOG_HOST'),
    'disabled' => filter_var(env('POSTHOG_DISABLED', false), FILTER_VALIDATE_BOOLEAN),
];
