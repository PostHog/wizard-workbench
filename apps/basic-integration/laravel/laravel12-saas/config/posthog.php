<?php

$apiKey = env('POSTHOG_PROJECT_TOKEN');
$host = env('POSTHOG_HOST');

return [
    'api_key' => $apiKey,
    'host' => $host,
    'disabled' => env('POSTHOG_DISABLED', ! filled($apiKey) || ! filled($host)),
];
