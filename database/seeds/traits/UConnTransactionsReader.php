<?php

namespace Illuminate\Database\Seeder\Traits;

trait UConnTransactionsReader {
    protected function fixUConnProblems($row, $csvColumnsToIndex) {
        // The March dump has many zipcodes with no country. The majority of
        // these zipcodes are 5-digits, so let's assume it's a US country if
        // it's five digits.

        $zipcode_index = $csvColumnsToIndex['ZIP_CD'];
        $country_index = $csvColumnsToIndex['COUNTRY_CD'];

        if (strlen($row[$zipcode_index]) === 5 && empty($row[$country_index])) {
            $row[$country_index] = 'US';
        }

        return $row;
    }
}
