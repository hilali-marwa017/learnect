<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('avis', function (Blueprint $table) {
            $table->id('id_avis');
            $table->integer('note');
            $table->text('commentaire')->nullable();
            $table->foreignId('id_utilisateur')->constrained('users', 'utilisateur_id')->onDelete('cascade');
            $table->foreignId('id_enseignant')->constrained('enseignants', 'utilisateur_id')->onDelete('cascade');
            $table->foreignId('id_reservation')->constrained('reservations', 'id_reservation')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('avis');
    }
};