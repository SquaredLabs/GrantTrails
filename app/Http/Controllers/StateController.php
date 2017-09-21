<?php

namespace App\Http\Controllers;

use App\Location;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class StateController extends Controller
{
    /**
     * Retreive a listing of total expenditures by state
     *
     * @param  Request  $request
     * @return Response
     */
    public function index(Request $request)
    {
        return Location::withPurchases()
            ->where('country', 'US')
            ->where('state', '<>', '')
            ->groupBy('state')
            ->select(['state', \DB::raw('SUM(amount) as total')])
            ->rememberForever()
            ->get()
            ->pluck('total', 'state');
    }
}
