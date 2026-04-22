<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('demandes', function (Blueprint $table) {
            $table->id('id_demande');
            $table->string('matiere');
            $table->string('niveau');
            $table->decimal('budgetMin', 8, 2);
            $table->decimal('budgetMax', 8, 2);
            $table->string('ville');
            $table->enum('');
          
            $table->timestamp('expire_at')->nullable();
            $table->foreignId('id_utilisateur')
                  ->constrained('users', 'utilisateur_id')
                  ->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demandes');
    }
};