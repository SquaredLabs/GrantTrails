<?php

use Illuminate\Database\Seeder\Super\MultiCsvReader;

class AgencyTypesTableSeeder extends MultiCsvReader
{
    protected $csvColumnsToModelProperty = [
        'AGENCY_TYP_DESC' => 'name'
    ];

    protected function preRunHook()
    {
        // Keep a set of unique agency types we've added so we can quickly
        // query rather than running a DB query.
        $this->populatedAgencyTypes = [];
    }

    protected function shouldSkipRowHook($row)
    {
        $name = $row[$this->csvColumnsToIndex['AGENCY_TYP_DESC']];
        return array_key_exists($name, $this->populatedAgencyTypes) || $name === '';
    }

    protected function createNewModelHook($row)
    {
        return new App\AgencyType;
    }

    protected function postSaveHook($new)
    {
        $this->populatedAgencyTypes[$new->name] = NULL;
    }
}
