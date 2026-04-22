<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('etudiants', function (Blueprint $table) {
            $table->foreignId('utilisateur_id')->primary()->constrained('users', 'utilisateur_id')->onDelete('cascade');
            $table->string('niveau')->nullable();
            $table->decimal('budget', 8, 2)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('etudiants');
    }
};