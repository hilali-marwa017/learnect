public function up(): void
{
    Schema::table('enseignants', function (Blueprint $table) {
        $table->text('raison_refus')->nullable()->after('estVerifie');
    });
}

public function down(): void
{
    Schema::table('enseignants', function (Blueprint $table) {
        $table->dropColumn('raison_refus');
    });
}