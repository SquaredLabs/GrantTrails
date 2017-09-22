<?php

namespace Illuminate\Database\Seeder\Traits;

trait CsvReader {
    protected function csvLines($file = NULL) {
        $file = $file ?: $this->dataFile;

        // sample-022117.csv was generated from an xlxs in Excel, so it has CRLF
        // endings. PHP will not detect this by default and load everything on
        // one line.
        ini_set('auto_detect_line_endings', true);

        if (($handle = fopen($file, 'r')) == false) {
            throw new Exception('Unable to read CSV file.');
        }

        while (($row = fgetcsv($handle)) !== false) {
            yield $row;
            unset($data);
        }
        fclose($handle);
    }

    protected function csvHeader($file = NULL) {
        return $this->csvLines($file)->current();
    }

    protected function getColumnsToIndexMap($file = NULL) {
      $csvColumnsToIndex = [];
      foreach ($this->csvHeader($file) as $index => $csvColumnName) {
          $csvColumnsToIndex[$csvColumnName] = $index;
      }
      return $csvColumnsToIndex;
    }

    protected function csvRows($file = NULL) {
        $lines = $this->csvLines($file);
        $lines->next(); // skip first line.

        while ($lines->valid()) {
            yield $lines->current();
            $lines->next();
        }
    }
}
