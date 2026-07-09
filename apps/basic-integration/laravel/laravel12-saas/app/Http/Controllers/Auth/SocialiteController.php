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
    public function redirect($provider, PostHogService $posthog)
    {
        if (Auth::check()) {
            $posthog->capture(Auth::user()->getPostHogDistinctId(), 'social_login_started', [
                'provider' => $provider,
            ]);
        }

        return Socialite::driver($provider)->redirect();
    }

    public function callback($provider, PostHogService $posthog)
    {
        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (Exception $e) {
            return redirect('/login')->withErrors(['error' => 'Unable to login using '.$provider]);
        }

        $user = User::where([
            'provider' => $provider,
            'provider_id' => $socialUser->getId(),
        ])->first();

        $wasCreated = false;

        if (! $user) {
            $user = User::create([
                'name' => $socialUser->getName(),
                'email' => $socialUser->getEmail(),
                'provider' => $provider,
                'provider_id' => $socialUser->getId(),
                'password' => bcrypt(str()->random(16)),
            ]);
            $wasCreated = true;
        }

        Auth::login($user);

        $posthog->identify($user->getPostHogDistinctId(), $user->getPostHogPersonProperties());
        $posthog->capture($user->getPostHogDistinctId(), 'social_login_completed', [
            'provider' => $provider,
            'is_new_user' => $wasCreated,
        ]);

        if ($wasCreated) {
            $posthog->capture($user->getPostHogDistinctId(), 'user_signed_up', [
                'signup_method' => 'social',
                'provider' => $provider,
            ]);
        }

        return redirect('/dashboard');
    }
}
