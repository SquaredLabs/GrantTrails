<?php

use Illuminate\Database\Seeder\Super\MultiCsvReader;

class LocationsTableSeeder extends MultiCsvReader
{
    protected $csvColumnsToModelProperty = [
        'ZIP_CD' => 'zipcode',
        'COUNTRY_CD' => 'country',
        'CITY_NM' => 'city',
        'STATE_CD' => 'state'
    ];

    protected $geoNamesPostalFile = './database/seeds/data/allCountries.txt';

    // From http://download.geonames.org/export/zip/readme.txt
    protected $geoNamesPostalProperties = [
        'country',
        'zipcode',
        'locality',
        'state',
        'state_code',
        'county',
        'county_code',
        'community',
        'community_code',
        'latitude',
        'longitude'
    ];

    public function downloadAllCountriesData() {
        $zipLocation = './database/seeds/data/allCountries.zip';
        $originLocation = 'http://download.geonames.org/export/zip/allCountries.zip';

        $zipExists = file_exists($zipLocation);
        $txtExists = file_exists($this->geoNamesPostalFile);

        if (!$zipExists && !$txtExists) {
            echo "Downloading $originLocation ... ";
            file_put_contents($zipLocation, fopen($originLocation, 'r'));
            echo "Done." . PHP_EOL;
        }

        if (!$txtExists) {
            $zip = new ZipArchive;
            if ($zip->open($zipLocation) === TRUE) {
                $zip->extractTo('./database/seeds/data/');
                $zip->close();
            }

            unlink($zipLocation);
        }
    }

    private function getGeoNamesIndexFor($name)
    {
        return array_search($name, $this->geoNamesPostalProperties);
    }

    public function buildPostalDataDictionary() {
        $allCountries = [];

        $handle = fopen($this->geoNamesPostalFile, 'r');
        if ($handle) {
            while (($line = fgets($handle)) !== false) {

                // Key first two columns (country code and zipcode respectively).
                $properties = explode("\t", trim($line));
                $country = $properties[array_search('country', $this->geoNamesPostalProperties)];
                $zipcode = $properties[array_search('zipcode', $this->geoNamesPostalProperties)];

                $allCountries["$zipcode $country"] = $properties;
            }

            fclose($handle);
        }

        return $allCountries;
    }

    /**
     * Setup before seeding starts.
     */
    protected function preRunHook()
    {
        ini_set('memory_limit', '1024M');

        $this->downloadAllCountriesData();
        $this->postalData = $this->buildPostalDataDictionary();

        // Keep a set of unique locations we've added so we can quickly skip
        // them for future rows.
        $this->populatedLocations = [];
    }

    protected function transformRowHook($row)
    {
        // Our data structure is a double array of keys and values since
        // creating dictionaries for every row will be memory intensive.
        $zipcode = $row[$this->csvColumnsToIndex['ZIP_CD']];
        $country = $row[$this->csvColumnsToIndex['COUNTRY_CD']];

        $zipcode = App\Location::geoNameZipcode($zipcode, $country);
        $row[$this->csvColumnsToIndex['ZIP_CD']] = $zipcode;

        return $row;
    }

    protected function shouldSkipRowHook($row)
    {
        $zipcode = $row[$this->csvColumnsToIndex['ZIP_CD']];
        $country = $row[$this->csvColumnsToIndex['COUNTRY_CD']];

        return $zipcode === '' || $country === '' || array_key_exists("$zipcode $country", $this->populatedLocations);
    }

    protected function createNewModelHook($row)
    {
        return new App\Location;
    }

    protected function setNonstringPropertiesHook($new, $row)
    {
        $zipcode = $row[$this->csvColumnsToIndex['ZIP_CD']];
        $country = $row[$this->csvColumnsToIndex['COUNTRY_CD']];

        if (array_key_exists("$zipcode $country", $this->postalData)) {
            $geonameRecord = $this->postalData["$zipcode $country"];
            $new->city = $geonameRecord[$this->getGeoNamesIndexFor('locality')];
            $new->state = $geonameRecord[$this->getGeoNamesIndexFor('state_code')];
            $new->longitude = $geonameRecord[$this->getGeoNamesIndexFor('longitude')];
            $new->latitude = $geonameRecord[$this->getGeoNamesIndexFor('latitude')];
        } else {
            print("Could not find $zipcode $country from GeoNames. Using \"$new->city\" and \"$new->state\" from CSV file." . PHP_EOL);
        }

        $this->populatedLocations["$zipcode $country"] = NULL;

        return $new;
    }
}
