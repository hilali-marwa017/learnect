<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE users MODIFY COLUMN statut ENUM('actif','bloque','en_attente','refuse') NOT NULL DEFAULT 'en_attente'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE users MODIFY COLUMN statut ENUM('actif','bloque','en_attente') NOT NULL DEFAULT 'en_attente'");
    }
};