<?php
namespace App\Http\Controllers;
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class RegisterController extends Controller
{
    public function showRegisterForm()
    {
        return view('auth.register');
    }

    public function register(Request $request)
{
    // Form doğrulaması
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8|confirmed',
    ]);

    try {
        // Kullanıcıyı oluştur
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Şifreyi hash'le
        ]);

        // Kullanıcıyı giriş yaptır
        Auth::login($user);

        return redirect()->route('/login'); // Dashboard'a yönlendir
    } catch (\Exception $e) {
        // Hata durumunda, hata mesajını döndür
        return back()->withErrors(['message' => 'Bir hata oluştu, lütfen tekrar deneyiniz.']);
    }
}

}

