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

        $isNew = ! $existing;

        $user = $existing ?? User::create([
            'name' => $socialUser->getName(),
            'email' => $socialUser->getEmail(),
            'provider' => $provider,
            'provider_id' => $socialUser->getId(),
            'password' => bcrypt(str()->random(16)),
        ]);

        Auth::login($user);

        $posthog->identify($user->email, [
            'email' => $user->email,
            'name' => $user->name,
            'date_joined' => $user->created_at->toISOString(),
        ]);

        if ($isNew) {
            $posthog->capture($user->email, 'user_registered_via_social', [
                'provider' => $provider,
            ]);
        } else {
            $posthog->capture($user->email, 'user_logged_in_via_social', [
                'provider' => $provider,
            ]);
        }

        return redirect('/dashboard');
    }
}
