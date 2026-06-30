<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enseignants', function (Blueprint $table) {
            // ✅ FIX PRINCIPAL : foreignId + primary() explicite
            // Sans primary(), Laravel cherche une colonne "id" auto-increment
            // => update() plante en 500 car la PK est introuvable
            $table->unsignedBigInteger('utilisateur_id');
            $table->foreign('utilisateur_id')
                  ->references('utilisateur_id')
                  ->on('users')
                  ->onDelete('cascade');
            $table->primary('utilisateur_id'); // ✅ ESSENTIEL

            // ✅ FIX : ajout cin_recto / cin_verso manquants
            $table->string('cin_recto')->nullable();
            $table->string('cin_verso')->nullable();
            $table->string('diplome')->nullable(); // nullable pour completeProfile

            $table->string('titre')->nullable();
            $table->text('description_cours')->nullable();
            $table->text('description_profil')->nullable();
            $table->boolean('cours_domicile')->default(false);
            $table->boolean('cours_deplacement')->default(false);
            $table->boolean('cours_enligne')->default(false);
            $table->integer('distance_max')->nullable();
            $table->string('langues')->nullable();
            $table->decimal('tarifHeure', 8, 2)->nullable();
            $table->boolean('estVerifie')->default(false);
            $table->decimal('noteMoyenne', 3, 2)->default(0);
            $table->enum('statut_annonce', ['brouillon', 'en_ligne', 'suspendue'])
                  ->default('brouillon');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enseignants');
    }
};