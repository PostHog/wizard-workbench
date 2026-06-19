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

        $existing = User::where([
            'provider' => $provider,
            'provider_id' => $socialUser->getId(),
        ])->first();

        if (! $existing) {
            $user = User::create([
                'name' => $socialUser->getName(),
                'email' => $socialUser->getEmail(),
                'provider' => $provider,
                'provider_id' => $socialUser->getId(),
                'password' => bcrypt(str()->random(16)),
            ]);

            Auth::login($user);

            $posthog->identify($user->email, [
                'name' => $user->name,
                'email' => $user->email,
                'date_joined' => $user->created_at->toISOString(),
            ]);
            $posthog->capture($user->email, 'social_signup_completed', [
                'provider' => $provider,
            ]);
        } else {
            $user = $existing;
            Auth::login($user);

            $posthog->identify($user->email, [
                'name' => $user->name,
                'email' => $user->email,
                'date_joined' => $user->created_at->toISOString(),
            ]);
            $posthog->capture($user->email, 'social_login_completed', [
                'provider' => $provider,
            ]);
        }

        return redirect('/dashboard');
    }
}
