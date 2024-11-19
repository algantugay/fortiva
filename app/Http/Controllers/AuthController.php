<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


class AuthController extends Controller
{
    // Login formunu göster
    public function showLoginForm()
    {
        return view('auth.login');
    }

    // Giriş işlemi
    public function login(Request $request)
    {
        // Kullanıcıdan gelen verileri doğrulama
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            dd('s');
            // Giriş başarılı, dashboard'a yönlendir
            return view('/');
        }

        // Giriş başarısız, hata mesajı ile geri dön
        return back()->withErrors([
            'email' => 'Email veya şifre hatalı.',
        ]);
    }

    // Logout işlemi
    public function logout(Request $request)
    {
        Auth::logout(); // Kullanıcıyı oturumdan çıkar

        // Oturum bilgilerini sıfırla ve güvenlik için token'ı yenile
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Giriş ekranına yönlendir
        return redirect()->route('login');
    }
}


