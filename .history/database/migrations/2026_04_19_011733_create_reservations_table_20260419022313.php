<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id('id_reservation');
            $table->date('date');
            $table->decimal('montant', 8, 2);
            $table->enum('statut', [
                'en_attente','confirmee','annulee','terminee'
            ])->default('en_attente');
            $table->foreignId('id_utilisateur')
                  ->constrained('users', 'utilisateur_id')
                  ->onDelete('cascade');
            $table->foreignId('id_creneau')
                  ->constrained('creneaux', 'id_creneau')
                  ->onDelete('cascade');
            $table->foreignId('id_offre')
                  ->nullable()
                  ->constrained('offres', 'id_offre')
                  ->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};