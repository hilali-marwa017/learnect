<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('creneaux', function (Blueprint $table) {
            $table->id('id_creneau');
            $table->enum('jour',['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche']);
            $table->time('heureDebut');
            $table->time('heureFin');
            $table->boolean('estDisponible')->default(true);
            $table->foreignId('id_enseignant')->constrained('enseignants', 'utilisateur_id')
                  ->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('creneaux');
    }
};