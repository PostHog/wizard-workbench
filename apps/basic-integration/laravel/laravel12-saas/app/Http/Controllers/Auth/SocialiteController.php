<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\PostHogService;
use App\Models\User;
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
            $posthog->captureException($e, null, [
                'social_provider' => $provider,
                'flow' => 'social_login_callback',
            ]);

            return redirect('/login')->withErrors(['error' => 'Unable to login using '.$provider]);
        }

        $user = User::where([
            'provider' => $provider,
            'provider_id' => $socialUser->getId(),
        ])->first();

        if (! $user) {
            $user = User::create([
                'name' => $socialUser->getName(),
                'email' => $socialUser->getEmail(),
                'provider' => $provider,
                'provider_id' => $socialUser->getId(),
                'password' => bcrypt(str()->random(16)),
            ]);
        }

        Auth::login($user);

        $posthog->identify($user->posthogDistinctId(), $user->posthogPersonProperties());
        $posthog->capture($user->posthogDistinctId(), 'social_login_completed', [
            'provider' => $provider,
            'is_new_account' => $user->wasRecentlyCreated,
        ]);

        return redirect('/dashboard');
    }
}
