public function up(): void
{
    Schema::create('users', function (Blueprint $table) {
        $table->id('utilisateur_id');
        $table->string('nom');
        $table->string('prenom');
        $table->string('email')->unique();
        $table->string('password'); // ← obligatoire pour Laravel Auth
        $table->string('telephone')->unique();
        $table->string('ville');
        $table->enum('role', ['etudiant','enseignant','admin'])
              ->default('etudiant');
        $table->enum('statut', ['actif','bloque','en_attente'])
              ->default('en_attente');
        $table->timestamps();
    });
}