<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\PostHogService;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request, PostHogService $posthog): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));

            // PostHog: Track email verification and update user properties
            $user = $request->user();
            $posthog->capture($user->email, 'email_verified', [
                'verification_delay_hours' => $user->created_at?->diffInHours(now()),
            ]);
            $posthog->identify($user->email, $user->getPostHogProperties());
        }

        return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
    }
}
