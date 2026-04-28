@php
    $logoPath = data_get(config('branding'), 'assets.logo', 'images/logo.png');
    $brandName = data_get(config('branding'), 'name', config('app.name', 'Laravel'));
@endphp

<img {{ $attributes }} src="{{ asset($logoPath) }}" alt="{{ $brandName }}">
