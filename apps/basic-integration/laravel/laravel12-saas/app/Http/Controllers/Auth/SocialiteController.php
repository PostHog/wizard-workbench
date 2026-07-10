<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\PostHogService;
use Exception;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    public function redirect($provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    public function callback($provider, PostHogService $posthog)
    {
        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (Exception $e) {
            return redirect('/login')->withErrors(['error' => 'Unable to login using '.$provider]);
        }

        $existingUser = User::where([
            'provider' => $provider,
            'provider_id' => $socialUser->getId(),
        ])->first();

        if (! $existingUser) {
            $user = User::create([
                'name' => $socialUser->getName(),
                'email' => $socialUser->getEmail(),
                'provider' => $provider,
                'provider_id' => $socialUser->getId(),
                'password' => bcrypt(str()->random(16)),
            ]);

            // PostHog: Identify and track new user signup via social provider
            $posthog->identify((string) $user->id, $user->getPostHogProperties());
            $posthog->capture((string) $user->id, 'user_signed_up_with_google', [
                'provider' => $provider,
            ]);
        } else {
            $user = $existingUser;

            // PostHog: Identify and track existing user login via social provider
            $posthog->identify((string) $user->id, $user->getPostHogProperties());
            $posthog->capture((string) $user->id, 'user_logged_in_with_google', [
                'provider' => $provider,
                'login_method' => $provider,
            ]);
        }

        Auth::login($user);

        return redirect('/dashboard');
    }
}
