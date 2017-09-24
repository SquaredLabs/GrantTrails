<?php

use Elasticsearch\ClientBuilder;
use App\Location;

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of your Closure based console
| commands. Each Closure is bound to a command instance allowing a
| simple approach to interacting with each command's IO methods.
|
*/

Artisan::command('elasticsearch:reindex', function() {
    // Not sure why this command requires so much memory. I have a feeling
    // it's due to locations already indexed not being freed quickly enough
    // from past loops.
    ini_set('memory_limit', '2048M');

    $client = ClientBuilder::create()
      ->setHosts([config('elasticsearch.host')])
      ->build();

    $index = config('elasticsearch.index');

    // Clear indices to remove stale documents
    if ($client->indices()->exists([ 'index' => $index ])) {
        $response = $client->indices()->delete([ 'index' => $index ]);
    }

    $locations = Location::havingCoordinates()
        // Only show CT for now. We'll do a national version in a future
        // release.
        ->where('state', 'CT')
        ->get();
    foreach ($locations as $location) {
        $client->index([
            'index' => \Config::get('elasticsearch.index'),
            'type' => 'location',
            'id' => $location->id,
            'body' => $location->toSearchableArray()
        ]);
    }
})->describe('Reindex Elasticsearch');
