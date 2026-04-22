<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('utilisateur_id');
            $table->string('nom');
            $table->string('prenom');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('photo')->nullable();
            $table->string('telephone')->unique();
            $table->string('ville');
            $table->enum('role', ['etudiant','enseignant','admin'])
                  ->default('etudiant');
            $table->enum('statut', ['actif','bloque','en_attente'])
                  ->default('en_attente');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};