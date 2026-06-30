public function run(): void
{
    $this->call([
        UserSeeder::class,      // D'abord les users
        MatiereSeeder::class,   // Ensuite les matières
    ]);
}