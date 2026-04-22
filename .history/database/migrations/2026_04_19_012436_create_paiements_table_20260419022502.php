<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paiements', function (Blueprint $table) {
            $table->id('id_paiement');
            $table->decimal('montantTotal', 8, 2);
            $table->decimal('comission', 8, 2);
            $table->decimal('montantEnseignant', 8, 2);
            $table->enum('methode',['paypal','simulation'])->default('simulation');
            $table->enum('statut',['en_attente','paye','rembourse'])->default('en_attente');
            $table->foreignId('id_reservation')
                  ->constrained('reservations', 'id_reservation')
                  ->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};