<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('otp_verifications', function (Blueprint $table) {
            $table->id('id_otp');
            $table->string('telephone');
            $table->string('code');
            $table->timestamp('expire_at');
            $table->boolean('est_utilise')->default(false);
            $table->enum('type', ['inscription','connexion'])->default('inscription');
            $table->foreignId('id_utilisateur')
                  ->constrained('users', 'utilisateur_id')
                  ->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('otp_verifications');
    }
};