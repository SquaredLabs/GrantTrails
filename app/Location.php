<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use DB;
use Watson\Rememberable\Rememberable;

class Location extends Model
{
    use Rememberable;

    /**
     * Get the purchases for the location.
     */
    public function purchases()
    {
        return $this->hasMany('App\Purchase');
    }

    /**
     * Simplify zipcodes so they match with ones provided by GeoNames
     */
    static public function geoNameZipcode($zipcode, $country_code) {
        // The substr removals here are to place zipcodes in a format that
        // matches the GeoNames postal code database.

        // Once alternative solution involves checking if any zipcodes in the
        // GeoNames database matches the first part of a location's zipcode
        // (within the same country), but I can't think of a way to make this
        // quick without some sort of fuzzy hashing.
        //
        // It would be O(# of GeoName zipcodes ✖️ # of locations) instead of
        // O(# locations).
        //
        // So we'll do this for now. We could also automate this a bit more by
        // parsing the allCountries.txt file and checking how long zipcodes are
        // there.

        // Remove ZIP+4 codes from United States zip codes.
        if ($country_code === 'US') {
            return substr($zipcode, 0, 5);
        }

        // Remove local delivery unit (LRU) codes from Canadian zip codes
        // since the GeoNames database only has the first part.
        if ($country_code === 'CA') {
            return substr($zipcode, 0, 3);
        }

        // Remove Inward Code
        if ($country_code === 'GB') {
            return substr($zipcode, 0, 4);
        }

        return $zipcode;
    }

    /**
     * Get only the locations that have lat/lon coordinates
     */
    public function scopeHavingCoordinates($query) {
        return $query
            ->where('longitude', '<>', NULL)
            ->where('latitude', '<>', NULL);
    }

    public function scopeWithPurchaseStats ($query) {
        return $query
            ->withPurchases()
            ->select([
                'locations.*',
                DB::raw('SUM(purchases.amount) as total'),
                DB::raw('COUNT(purchases.cardinality) as transactions')
            ]);
    }

    /**
     * Get locations with purchases
     */
    public function scopeWithPurchases($query) {
        return $query
            ->leftJoin('purchases', 'locations.id', '=', 'purchases.location_id')
            ->groupBy('locations.id')
            // Take out indirect costs since they're irrelevant and inconsistent.
            ->where('expense_category_id', '<>', 7);
    }

    /*
     * Scope with information to build a GeoJSON file
     */
    public function scopeForGeoJSON ($query) {
        return $query
            ->select([
                'locations.id',
                'locations.state',
                'longitude',
                'latitude',
                DB::raw('SUM(purchases.amount) as total'),
                DB::raw('COUNT(purchases.cardinality) as transactions')
            ]);
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array
     */
    public function toSearchableArray()
    {
        $array = $this->toArray();

        $array['total'] = $this->purchases->sum('amount');
        $array['transactions'] = $this->purchases->count();

        return $array;
    }

    /**
     * Returns an array
     */
    static public function locationsToGeoJSON($locations)
    {
        $featureCollection = [
            'type' => 'FeatureCollection',
            'features' => []
        ];

        foreach ($locations as $location) {
            $point = [
                'type' => 'Feature',
                'geometry' => [
                    'type' => 'Point',
                    'coordinates' => [ $location->longitude, $location->latitude ]
                ],
                'properties' => [
                    'id' => $location->id,
                    'state' => $location->state,
                    'total' => $location->total,
                    'transactions' => $location->transactions
                ]
            ];

            $featureCollection['features'][] = $point;
        }

        return $featureCollection;
    }

    /**
     * Scope location statistics with user filters from frontend
     */
    public function scopeFiltered($query, $filters, $request)
    {
        /*
         * Payees
         */
        if ($filters->contains('Payees.Employees')) {
            $names = ['Salary', 'Fringe Benefits'];
            $employees = ExpenseCategory::whereIn('name', $names)
                ->select('id')
                ->get()
                ->map(function($expenseCategory) { return $expenseCategory->id; });
            $query->whereIn('purchases.expense_category_id', $employees);
        }

        if ($filters->contains('Payees.Vendors')) {
            $names = [
                'Specialized Service Facilities',
                'Equipment > $5,000',
                'Equipment < $5,000',
                'Consultants',
                'Contractuals'
            ];
            $vendors = ExpenseCategory::whereIn('name', $names)
                ->select('id')
                ->get()
                ->map(function($expenseCategory) { return $expenseCategory->id; });
            $query->whereIn('purchases.expense_category_id', $vendors);
        }

        if ($filters->contains('Payees.Subagreements')) {
            $subagreements = ExpenseCategory::where('name', 'Subagreements')
                ->select('id')
                ->firstOrFail();
            $query->where('purchases.expense_category_id', $subagreements->id);
        }

        if ($filters->contains('Payees.Other')) {
            $names = [
                'Travel - Domestic',
                'Travel - Foreign',
                'Student Fees/Expenses',
                'Other Expense'
            ];
            $other = ExpenseCategory::whereIn('name', $names)
                ->select('id')
                ->get()
                ->map(function($expenseCategory) { return $expenseCategory->id; });
            $query->whereIn('purchases.expense_category_id', $other);
        }

        /*
         * Grant Type
         */
        if ($filters->contains('Grant_Type.Federal')) {
            $federal = AgencyType::where('name', 'Federal')
                ->select('id')
                ->firstOrFail();
            $query->where('purchases.agency_type_id', $federal->id);
        }

        if ($filters->contains('Grant_Type.State')) {
            $state = AgencyType::whereIn('name', ['State/CT', 'State(Not CT)'])
                ->select('id')
                ->get()
                ->map(function($agencyType) { return $agencyType->id; });
            $query->whereIn('purchases.agency_type_id', $state);
        }

        if ($filters->contains('Grant_Type.Corporate')) {
            $corporate = AgencyType::where('name', 'Corporate')
                ->select('id')
                ->firstOrFail();
            $query->where('purchases.agency_type_id', $corporate->id);
        }

        if ($filters->contains('Grant_Type.Other')) {
            $names = [
                'College/University',
                'Non-Profit',
                'Local Government',
                'International'
            ];
            $other = AgencyType::whereIn('name', $names)
                ->select('id')
                ->get()
                ->map(function($at) { return $at->id; });
            $query->whereIn('purchases.agency_type_id', $other);
        }

        /*
         * Fiscal Year
         */
        if ($request->has('Fiscal_Year')) {
            $query->whereIn('fiscal_year', $request->input('Fiscal_Year'));
        }

        return $query;
    }
}
