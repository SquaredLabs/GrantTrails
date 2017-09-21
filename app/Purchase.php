<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    /**
     * Get the payee location for the purchase.
     */
    public function location()
    {
        return $this->belongsTo('App\Location');
    }

    /**
     * Get the expense cateogry for the purchase.
     */
    public function expenseCategory()
    {
        return $this->belongsTo('App\ExpenseCategory');
    }

    /**
     * Get the agency type for the purchase.
     */
    public function agencyType()
    {
        return $this->belongsTo('App\AgencyType');
    }
}
