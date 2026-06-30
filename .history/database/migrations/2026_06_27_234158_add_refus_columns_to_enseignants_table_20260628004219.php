<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('enseignants', function (Blueprint $table) {
            $table->string('cin_recto')->nullable()->after('diplome');
            $table->string('cin_verso')->nullable()->after('cin_recto');
            $table->text('raison_refus')->nullable()->after('estVerifie');
        });
    }

    public function down(): void
    {
        Schema::table('enseignants', function (Blueprint $table) {
            $table->dropColumn(['cin_recto', 'cin_verso', 'raison_refus']);
        });
    }
};