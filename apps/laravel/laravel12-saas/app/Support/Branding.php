<?php

namespace App\Support;

class Branding
{
    public static function all(): array
    {
        return config('branding', []);
    }

    public static function name(): string
    {
        return (string) data_get(self::all(), 'name', config('app.name', 'Laravel'));
    }

    public static function tagline(): string
    {
        return (string) data_get(self::all(), 'tagline', '');
    }

    public static function description(): string
    {
        return (string) data_get(self::all(), 'description', '');
    }

    public static function supportEmail(): ?string
    {
        $email = data_get(self::all(), 'support.email');

        return $email ? (string) $email : null;
    }

    public static function asset(string $key, ?string $fallback = null): ?string
    {
        $path = data_get(self::all(), "assets.$key", $fallback);

        return $path ? (string) $path : null;
    }
}
