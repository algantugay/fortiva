<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return view('welcome');
});

// Dashboard rotası
Route::get('/dashboard', function () {
    return view('layouts.index');
})->middleware('auth');

// Login rotaları
Route::get('login', [AuthController::class, 'showLoginForm'])->name('login')->middleware('guest');

// Giriş yapma işlemi
Route::post('login', [AuthController::class, 'login'])->middleware('guest');

// Register rotaları
Route::get('/register', [RegisterController::class, 'showRegisterForm'])->name('register');
Route::post('/register', [RegisterController::class, 'register']);

// Logout rotası
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

