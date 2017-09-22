<?php

namespace Illuminate\Database\Seeder\Super;

use Illuminate\Database\Seeder;
use Illuminate\Database\Seeder\Traits\CsvReader;
use Illuminate\Database\Seeder\Traits\UConnTransactionsReader;

class MultiCsvReader extends Seeder
{
    use CsvReader;
    use UConnTransactionsReader;

    /**
     * An array of CSV files to process. Should be overrided.
     */
    protected $dataDirectory = './database/seeds/data/transactions';

    /**
     * CSV columns to automatically insert as strings. Should be overrided.
     */
    protected $csvColumnsToModelProperty;

    /**
     * Populate locations for a single file.
     *
     * @return void
     */
    private function seedFile($file)
    {
        $this->csvColumnsToIndex = $this->getColumnsToIndexMap($file);

        foreach ($this->csvRows($file) as $row) {
            $row = $this->fixUConnProblems($row, $this->csvColumnsToIndex);
            $row = $this->transformRowHook($row);

            if ($this->shouldSkipRowHook($row)) {
                continue;
            }

            $new = $this->createNewModelHook($row);

            foreach ($this->csvColumnsToModelProperty as $csvColName => $modelProperty) {
                $modelProperty = $this->csvColumnsToModelProperty[$csvColName];
                if (array_key_exists($csvColName, $this->csvColumnsToIndex)) {
                    $new->$modelProperty = $row[$this->csvColumnsToIndex[$csvColName]];
                }
            }

            $new = $this->setNonstringPropertiesHook($new, $row);
            $new->save();

            $this->postSaveHook($new);
        }
    }

    /**
     * Setup before seeding starts.
     */
    protected function preRunHook()
    {
        return;
    }

    /**
     * Fix any data in the row before working on it.
     */
    protected function transformRowHook($row) {
        return $row;
    }

    /**
     * Should we skip the current row for any reason?
     */
    protected function shouldSkipRowHook($row)
    {
        return false;
    }

    /**
     * Hook to create new model.
     */
    protected function createNewModelHook($row)
    {
        throw new Exception('createNewModelHook must be overrided');
    }

    /**
     * Hook for any additional properties that should be set.
     */
    protected function setNonstringPropertiesHook($new, $row)
    {
        return $new;
    }

    /**
     * Hook for after a new model has been inserted.
     */
    protected function postSaveHook($new)
    {
        return;
    }

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->preRunHook();

        foreach(glob($this->dataDirectory.'/*.csv') as $file) {
            $this->seedFile($file);
        }
    }
}
