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
            'password'=>''

        ]);

    }

    
}
