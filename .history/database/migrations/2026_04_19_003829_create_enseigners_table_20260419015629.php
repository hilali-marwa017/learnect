<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enseigners', function (Blueprint $table) {
            $table->foreignId('id_enseignant')>constrained('enseignants', 'utilisateur_id')->onDelete('cascade');
            $table->foreignId('id_matiere')->constrained('matieres', 'id_matiere')0onDelete('cascade');
            $table->string('niveau')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enseigners');
    }
};