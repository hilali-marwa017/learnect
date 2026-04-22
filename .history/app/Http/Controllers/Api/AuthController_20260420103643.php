<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    //inscription

    public function register(Request $request){
        //validation

        $request->validate([
            'nom'=>'required|string|max:255|min:3',
            'prenom'=>'required|string|max:255|min:3',
            'email'=>'required|email|unique:users,email',
            'password'=>'required|min:8|confirmed',
            'telephone'=>'required|string|unique:users,telephone', //unique dans la table users
            'ville'=>'required|string',
            'role'=>'required|in:etudiant,enseignant',
        ]);

        //2-creer le user
        $user = User::create([
            'nom'=>$Request->nom,
            'prenom'=>$request->prenom,
            'email'=>$request->email,
            'password'=>$request->password,
            'telephone'=>$request->telephone,
            'ville'=>$request->ville,
            'role'
        ]);

    }

    
}
