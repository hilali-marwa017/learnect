<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id('id_message');
            $table->text('contenu');
            $table->foreignId('id_expediteur')->constrained('users', 'utilisateur_id')->onDelete('cascade');
            $table->foreignId('id_destinataire')->constrained('users', 'utilisateur_id')->onDelete('cascade');
            $table->foreignId('id_reservation')
                  ->constrained('reservations', 'id_reservation')
                  ->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};