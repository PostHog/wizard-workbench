<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use PostHog\PostHog;

class SocialiteController extends Controller
{
    public function redirect($provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    public function callback($provider)
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

        $isNewUser = false;
        if (! $user) {
            $user = User::create([
                'name' => $socialUser->getName(),
                'email' => $socialUser->getEmail(),
                'provider' => $provider,
                'provider_id' => $socialUser->getId(),
                'password' => bcrypt(str()->random(16)),
            ]);
            $isNewUser = true;
        }

        Auth::login($user);

        if ($isNewUser) {
            PostHog::capture([
                'distinctId' => (string) $user->id,
                'event' => 'user_signed_up',
                'properties' => ['method' => $provider],
            ]);
        } else {
            PostHog::capture([
                'distinctId' => (string) $user->id,
                'event' => 'user_logged_in',
                'properties' => ['method' => $provider],
            ]);
        }

        return redirect('/dashboard');
    }
}
