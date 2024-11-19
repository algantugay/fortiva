<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Routing\Controller;

class DashboardController extends Controller
{
    public function __construct()
    {
        // Kullanıcı giriş yapmamışsa login sayfasına yönlendir.
        $this->middleware('auth');
    }

    public function index()
    {
        return view('layouts.index');
    }
}
