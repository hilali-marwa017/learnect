<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('signalements', function (Blueprint $table) {
            $table->id('id_signalement');
            $table->text('motif');
            $table->enum('statut', ['en_attente','traite'])
                  ->default('en_attente');
            $table->foreignId('id_avis')
                  ->constrained('avis', 'id_avis')
                  ->onDelete('cascade');
            $table->foreignId('id_signaleur')
                  ->constrained('users', 'utilisateur_id')
                  ->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('signalements');
    }
};