<?php

namespace App\Services;

use PostHog\PostHog;
use Stringable;
use Throwable;

class PostHogService
{
    public static function cleanProperties(array $properties): array
    {
        return array_filter(
            $properties,
            static fn (mixed $value): bool => ! ($value instanceof Stringable && $value->isEmpty()) && $value !== null && $value !== ''
        );
    }

    public function identify(?string $distinctId, array $properties = []): void
    {
        if (! $this->isEnabled() || blank($distinctId)) {
            return;
        }

        PostHog::identify([
            'distinctId' => $distinctId,
            'properties' => $properties,
        ]);
    }

    public function capture(?string $distinctId, string $event, array $properties = []): void
    {
        if (! $this->isEnabled() || blank($distinctId)) {
            return;
        }

        PostHog::capture([
            'distinctId' => $distinctId,
            'event' => $event,
            'properties' => $properties,
        ]);
    }

    public function captureException(Throwable $exception, ?string $distinctId = null, array $properties = []): void
    {
        if (! $this->isEnabled()) {
            return;
        }

        PostHog::captureException($exception, $distinctId, self::cleanProperties($properties));
    }

    private function isEnabled(): bool
    {
        return filled(config('services.posthog.api_key')) && ! config('services.posthog.disabled', false);
    }
}
