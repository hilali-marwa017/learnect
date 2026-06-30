<?php
// database/migrations/xxxx_remove_cash_from_paiements.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Sur MySQL, on recrée la colonne enum sans 'cash'
        \DB::statement("ALTER TABLE paiements MODIFY methode ENUM('simulation') DEFAULT 'simulation'");
    }

    public function down(): void
    {
        \DB::statement("ALTER TABLE paiements MODIFY methode ENUM('simulation','cash') DEFAULT 'simulation'");
    }
};