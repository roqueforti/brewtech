<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // 1. Cek apakah user sudah login
        if (!Auth::check()) {
            return redirect('login');
        }

        // 2. Cek apakah role user sesuai dengan yang diminta route
        if (Auth::user()->role !== $role) {
            // Jika user memaksa masuk halaman pengajar padahal dia student (atau sebaliknya)
            abort(403, 'Akses Ditolak. Anda tidak memiliki izin.');
        }

        return $next($request);
    }
}