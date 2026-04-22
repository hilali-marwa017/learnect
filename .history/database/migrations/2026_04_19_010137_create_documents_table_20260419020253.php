<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id('id_document');
            $table->enum('type', ['cin','diplome']);
            $table->string('chemin_fichier');
            $table->enum('statut', ['en_attente','valide','refuse'])->default('en_attente');
            $table->text('commentaire_admin')->nullable();
            $table->foreignId('id_enseignant')->constrained('enseignants', 'utilisateur_id')
                  ->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};