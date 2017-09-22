<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $startTime = microtime(true);

        $this->call(LocationsTableSeeder::class);
        $this->call(ExpenseCategoriesTableSeeder::class);
        $this->call(AgencyTypesTableSeeder::class);
        $this->call(PurchasesTableSeeder::class);

        $executionTime = (microtime(true) - $startTime) / 60;
        echo "Seeding finished in $executionTime minutes." . PHP_EOL;
    }
}
