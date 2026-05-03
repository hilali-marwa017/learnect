<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enseignants', function (Blueprint $table) {
            $table->foreignId('utilisateur_id')->constrained('users', 'utilisateur_id')->onDelete('cascade');
            //$table->string('cin')->nullable();
            $table->string('diplome')->nullable();
            $table->string('titre')->nullable();
            $table->text('description_cours')->nullable();
            $table->text('description_profil')->nullable();
            $ztable
            $table->integer('distance_max')->nullable();
            $table->string('langues')->nullable();
            $table->decimal('tarifHeure', 8, 2)->nullable();
            $table->boolean('estVerifie')->default(false);
            $table->decimal('noteMoyenne', 3, 2)->default(0);
            $table->enum('statut_annonce',['brouillon','en_ligne','suspendue'])->default('brouillon');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enseignants');
    }
};