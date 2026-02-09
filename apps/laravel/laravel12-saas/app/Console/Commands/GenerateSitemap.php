<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class GenerateSitemap extends Command
{
    protected $signature = 'sitemap:generate';

    protected $description = 'Generate the sitemap.';

    public function handle(): void
    {
        $sitemap = Sitemap::create();
        $now = Carbon::now();

        $pages = [
            [
                'url' => route('home'),
                'priority' => 1.0,
                'changeFrequency' => Url::CHANGE_FREQUENCY_DAILY,
                'lastModificationDate' => $now,
            ],
            [
                'url' => route('features'),
                'priority' => 0.9,
                'changeFrequency' => Url::CHANGE_FREQUENCY_WEEKLY,
                'lastModificationDate' => $now->subWeek(),
            ],
            [
                'url' => route('pricing'),
                'priority' => 0.9,
                'changeFrequency' => Url::CHANGE_FREQUENCY_WEEKLY,
                'lastModificationDate' => $now->subWeek(),
            ],
        ];

        foreach ($pages as $page) {
            $url = Url::create($page['url'])
                ->setPriority($page['priority'])
                ->setChangeFrequency($page['changeFrequency']);

            if (isset($page['lastModificationDate'])) {
                $url->setLastModificationDate($page['lastModificationDate']);
            }

            $sitemap->add($url);
        }

        $sitemap->writeToFile(public_path('sitemap.xml'));

        $this->info('Sitemap generated successfully.');
    }
}
