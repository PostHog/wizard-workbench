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
            // PostHog: Track failed OAuth login
            $posthog->captureException($e);

            return redirect('/login')->withErrors(['error' => 'Unable to login using '.$provider]);
        }

        $user = User::where([
            'provider' => $provider,
            'provider_id' => $socialUser->getId(),
        ])->first();

        $isNewUser = false;
        if (! $user) {
            $isNewUser = true;
            $user = User::create([
                'name' => $socialUser->getName(),
                'email' => $socialUser->getEmail(),
                'provider' => $provider,
                'provider_id' => $socialUser->getId(),
                'password' => bcrypt(str()->random(16)),
            ]);
        }

        Auth::login($user);

        // PostHog: Identify and track OAuth login
        $posthog->identify($user->email, $user->getPostHogProperties());
        $posthog->capture($user->email, 'socialite_login_completed', [
            'provider' => $provider,
            'is_new_user' => $isNewUser,
        ]);

        // Also track signup if this is a new user
        if ($isNewUser) {
            $posthog->capture($user->email, 'user_signed_up', [
                'signup_method' => 'oauth',
                'provider' => $provider,
            ]);
        }

        return redirect('/dashboard');
    }
}
