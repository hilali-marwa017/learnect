<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('offres', function (Blueprint $table) {
            $table->id('id_offre');
            $table->decimal('prix', 8, 2);
            $table->text('message')->nullable();
            $table->enum('statut',['en_attente','acceptee','refusee'])
                  ->default('en_attente');
            $table->timestamp('dateCreation')->useCurrent();
            $table->foreignId('id_demande')
                  ->constrained('demandes', 'id_demande')
                  ->onDelete('cascade');
            $table->foreignId('id_enseignant')
                  ->constrained('enseignants', 'utilisateur_id')
                  ->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offres');
    }
};