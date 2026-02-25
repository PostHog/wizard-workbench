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

        $isNewUser = ! $existingUser;

        if ($isNewUser) {
            $user = User::create([
                'name' => $socialUser->getName(),
                'email' => $socialUser->getEmail(),
                'provider' => $provider,
                'provider_id' => $socialUser->getId(),
                'password' => bcrypt(str()->random(16)),
            ]);
        } else {
            $user = $existingUser;
        }

        Auth::login($user);

        // PostHog: identify user and track social auth
        $posthog->identify($user->email, $user->getPostHogProperties());
        $posthog->capture($user->email, 'social_auth_completed', [
            'provider' => $provider,
            'is_new_user' => $isNewUser,
        ]);

        return redirect('/dashboard');
    }
}
