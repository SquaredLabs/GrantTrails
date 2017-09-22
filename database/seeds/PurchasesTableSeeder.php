<?php

use Illuminate\Database\Seeder\Super\MultiCsvReader;

class PurchasesTableSeeder extends MultiCsvReader
{
    protected $csvColumnsToModelProperty = [
        'AMT_POSTED' => 'amount',
        'UNIV_FISCAL_YR' => 'fiscal_year',
        'TRANSACTION_DT' => 'transaction_date',
    ];

    protected function preRunHook()
    {
        $this->locationsToId = [];
        foreach (App\Location::all() as $location) {
          $this->locationsToId["$location->zipcode $location->country"] = $location->id;
        }

        $this->expenseCategoriesToId = App\ExpenseCategory::all()->pluck('id', 'name');
        $this->agencyTypesToId = App\AgencyType::all()->pluck('id', 'name');
    }

    protected function createNewModelHook($row)
    {
        return new App\Purchase;
    }

    protected function setNonstringPropertiesHook($new, $row)
    {
        // Our data structure is a double array of keys and values since
        // creating dictionaries for every row will be memory intensive.
        $zipcode = $row[$this->csvColumnsToIndex['ZIP_CD']];
        $country = $row[$this->csvColumnsToIndex['COUNTRY_CD']];

        $zipcode = App\Location::geoNameZipcode($zipcode, $country);

        if (array_key_exists("$zipcode $country", $this->locationsToId)) {
            $new->location_id = $this->locationsToId["$zipcode $country"];
        }

        $expense_category = $row[$this->csvColumnsToIndex['EXP_CATEGORY_DESC']];
        if (!empty($expense_category)) {
            $new->expense_category_id = $this->expenseCategoriesToId[$expense_category];
        }

        $agency_type = $row[$this->csvColumnsToIndex['AGENCY_TYP_DESC']];
        if (!empty($agency_type)) {
            $new->agency_type_id = $this->agencyTypesToId[$agency_type];
        }

        return $new;
    }
}
