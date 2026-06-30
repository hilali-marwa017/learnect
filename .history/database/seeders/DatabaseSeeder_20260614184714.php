<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            AdminUserSeeder::class,
            TeacherTestSeeder::class,
            VilleSeeder::class,
            MatiereSeeder::class,
        ]);
    }
}