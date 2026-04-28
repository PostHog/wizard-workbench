<?php

/**
 * @see https://github.com/artesaos/seotools
 */

return [
    'meta' => [
        /*
         * The default configurations to be used by the meta generator.
         */
        'defaults' => [
            'title' => env('BRAND_SEO_TITLE', env('APP_NAME', 'MVPstarter')), // set false to total remove
            'titleBefore' => false, // Put defaults.title before page title, like 'It's Over 9000! - Dashboard'
            'description' => env('BRAND_SEO_DESCRIPTION', 'A modern SaaS starter kit.'), // set false to total remove
            'separator' => ' - ',
            'keywords' => ['SaaS', 'Laravel', 'Livewire', 'Tailwind CSS', 'Starter Kit'],
            'canonical' => 'current', // Set to null or 'full' to use Url::full(), set to 'current' to use Url::current(), set false to total remove
            'robots' => env('BRAND_SEO_ROBOTS', 'index,follow'), // Set to 'all', 'none' or any combination of index/noindex and follow/nofollow
        ],
        /*
         * Webmaster tags are always added.
         */
        'webmaster_tags' => [
            'google' => null,
            'bing' => null,
            'alexa' => null,
            'pinterest' => null,
            'yandex' => null,
            'norton' => null,
        ],

        'add_notranslate_class' => false,
    ],
    'opengraph' => [
        /*
         * The default configurations to be used by the opengraph generator.
         */
        'defaults' => [
            'title' => env('BRAND_SEO_TITLE', env('APP_NAME', 'MVPstarter')), // set false to total remove
            'description' => env('BRAND_SEO_DESCRIPTION', 'A modern SaaS starter kit.'), // set false to total remove
            'url' => null, // Set null for using Url::current(), set false to total remove
            'type' => env('BRAND_OG_TYPE', 'website'),
            'site_name' => env('BRAND_NAME', env('APP_NAME', 'MVPstarter')),
            'images' => [env('BRAND_OG_IMAGE', '/og/default.svg')],
        ],
    ],
    'twitter' => [
        /*
         * The default values to be used by the twitter cards generator.
         */
        'defaults' => [
            // 'card'        => 'summary',
            // 'site'        => '@LuizVinicius73',
        ],
    ],
    'json-ld' => [
        /*
         * The default configurations to be used by the json-ld generator.
         */
        'defaults' => [
            'title' => env('BRAND_SEO_TITLE', env('APP_NAME', 'MVPstarter')), // set false to total remove
            'description' => env('BRAND_SEO_DESCRIPTION', 'A modern SaaS starter kit.'), // set false to total remove
            'url' => null, // Set to null or 'full' to use Url::full(), set to 'current' to use Url::current(), set false to total remove
            'type' => 'WebPage',
            'images' => [env('BRAND_OG_IMAGE', '/og/default.svg')],
        ],
    ],
];
