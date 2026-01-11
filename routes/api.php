<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Workshop; // Jangan lupa import Model ini

// 1. Endpoint Login (Nanti untuk Mobile App)
// Route::post('/login', [AuthController::class, 'login']);

// 2. Endpoint Data Workshop (Public - Bisa diakses siapa saja tanpa login)
Route::get('/workshops', function () {
    // Ambil semua data workshop dari database
    $data = Workshop::all();

    // Kirimkan sebagai JSON (Bukan HTML/Inertia)
    return response()->json([
        'status' => 'success',
        'message' => 'Data workshop berhasil diambil',
        'total' => $data->count(),
        'data' => $data
    ]);
});

// 3. Endpoint Khusus User Login (Butuh Token)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});