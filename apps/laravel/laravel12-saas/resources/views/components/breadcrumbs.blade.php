@props([
    'items' => [],
])

@php
    $breadcrumbs = [];
    $currentUrl = url()->current();

    foreach ($items as $item) {
        $breadcrumbs[] = [
            'name' => $item['name'],
            'url' => $item['url'] ?? url($item['route'] ?? '#'),
        ];
    }

    $breadcrumbs[] = [
        'name' => $items[count($items) - 1]['name'] ?? 'Current Page',
        'url' => $currentUrl,
    ];
@endphp

@if (! empty($breadcrumbs))
    <nav aria-label="Breadcrumb" class="mb-4">
        <ol class="flex items-center space-x-2 text-sm text-gray-600">
            @foreach ($breadcrumbs as $index => $crumb)
                <li class="flex items-center">
                    @if ($index > 0)
                        <svg class="w-4 h-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                    @endif
                    @if ($index === count($breadcrumbs) - 1)
                        <span class="font-medium text-gray-900" aria-current="page">{{ $crumb['name'] }}</span>
                    @else
                        <a href="{{ $crumb['url'] }}" class="hover:text-gray-900">{{ $crumb['name'] }}</a>
                    @endif
                </li>
            @endforeach
        </ol>
    </nav>
@endif
