<?php

namespace App\Http\Controllers;

use App\Location;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Elasticsearch\ClientBuilder;

class LocationController extends Controller
{
    /**
     * Search locations
     *
     * @param  int  $id
     * @return Response
     */
    public function index(Request $request)
    {
        $size = $request->size > 30 ? 30 : ($request->size ?: 7);
        $search = $request->search ?: 'US';

        $params = [
            'index' => \Config::get('elasticsearch.index'),
            'type' => 'location',
            'size' => $size,
            'body' => [
                'query' => [
                    'multi_match' => [
                        'query' => $search,
                        'fields' => [ 'zipcode', 'city', 'state', 'country' ]
                    ]
                ],
                'sort' => [
                    [ 'total' => 'desc' ]
                ]
            ]
        ];

        $client = ClientBuilder::create()
          ->setHosts([config('elasticsearch.host')])
          ->build();
        $response = $client->search($params);

        return array_map(function($hit) {
            return $hit['_source'];
        }, $response['hits']['hits']);
    }

    public function get($id)
    {
        return Location::withPurchaseStats()
            ->where('locations.id', $id)
            ->firstOrFail();
    }
}
