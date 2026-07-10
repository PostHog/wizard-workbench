<?php

use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\ThemeController;
use App\Services\PostHogService;
use Illuminate\Support\Facades\Route;

Route::view('/', 'marketing.home')->name('home');
Route::view('/features', 'marketing.features')->name('features');
Route::get('/pricing', function (PostHogService $posthog) {
    $distinctId = auth()->check() ? auth()->user()->getPostHogDistinctId() : session()->getId();

    $posthog->capture($distinctId, 'pricing_viewed', [
        'is_authenticated' => auth()->check(),
    ]);

    return view('marketing.pricing');
})->name('pricing');

Route::get('/og/default.svg', function () {
    return response()
        ->view('og.default')
        ->header('Content-Type', 'image/svg+xml');
})->name('og.default');

Route::middleware(['auth'])->group(function () {   // EnsureUserIsSubscribed::class to middleware
    Route::view('/dashboard', 'dashboard')->name('dashboard');
});

Route::view('settings', 'profile')
    ->middleware(['auth'])
    ->name('profile');

Route::middleware(['auth'])->group(function () {
    Route::get('/subscribe', [SubscriptionController::class, 'index'])->name('subscribe');
    Route::post('/checkout', [SubscriptionController::class, 'checkout'])->name('checkout');
    Route::post('/swap', [SubscriptionController::class, 'swap'])->name('swap');
    Route::get('/billing-portal', [SubscriptionController::class, 'redirectToBillingPortal'])->name('billing-portal');

});

Route::get('/sitemap.xml', function () {
    return response()->file(public_path('sitemap.xml'));
});

Route::get('/robots.txt', function () {
    $content = implode("\n", [
        'User-agent: *',
        'Allow: /',
        'Disallow: /dashboard',
        'Disallow: /settings',
        'Disallow: /subscribe',
        'Disallow: /billing-portal',
        'Disallow: /auth/',
        '',
        'Sitemap: '.url('/sitemap.xml'),
    ]);

    return response($content)->header('Content-Type', 'text/plain');
});

Route::post('/theme/update', [ThemeController::class, 'update'])->name('theme.update');

Route::get('/auth/{provider}/redirect', [SocialiteController::class, 'redirect'])
    ->name('socialite.redirect');
Route::get('/auth/{provider}/callback', [SocialiteController::class, 'callback'])
    ->name('socialite.callback');

require __DIR__.'/auth.php';
