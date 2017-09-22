<?php

use Illuminate\Database\Seeder\Super\MultiCsvReader;

class ExpenseCategoriesTableSeeder extends MultiCsvReader
{
    protected $csvColumnsToModelProperty = [
        'EXP_CATEGORY_DESC' => 'name'
    ];

    protected function preRunHook()
    {
        // Keep a set of unique expense categories we've added so we can quickly
        // query rather than running a DB query.
        $this->populatedExpenseCategories = [];
    }

    protected function shouldSkipRowHook($row)
    {
        $name = $row[$this->csvColumnsToIndex['EXP_CATEGORY_DESC']];
        return array_key_exists($name, $this->populatedExpenseCategories);
    }

    protected function createNewModelHook($row)
    {
        return new App\ExpenseCategory;
    }

    protected function postSaveHook($new)
    {
        $this->populatedExpenseCategories[$new->name] = NULL;
    }
}
