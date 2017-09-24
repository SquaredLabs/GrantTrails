<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use DB;
use Redis;

use App\Location;
use App\ExpenseCategory;
use App\AgencyType;

/*
 * Points shown on the map are a combination of the Location and Purchase
 * models.
 */
class PointsController extends Controller
{
    /**
     * Return a geojson of filtered purchase locations
     */
    public function index(Request $request)
    {
        // Turn get params into a flat array for easier hashing and membership
        // testing.
        $filters = collect([]);
        foreach ($request->all() as $group => $options) {
            foreach ($options as $option) {
                $filters->push($group . '.' . $option);
            }
        }

        $locations = Location::havingCoordinates()
            ->withPurchases()
            ->filtered($filters, $request)
            ->forGeoJSON()
            // Only show CT for now. We'll do a national version in a future
            // release.
            ->where('state', 'CT')
            ->rememberForever()
            ->get();

        // SQL returns total as a string to prevent loss of precision. But
        // Mapbox on the frontend will want a numeric type for its data-driven
        // styling. So we'll do a cast.
        foreach ($locations as $location) {
            $location->total = floatval($location->total);
        }

        return Location::locationsToGeoJSON($locations);
    }
}
