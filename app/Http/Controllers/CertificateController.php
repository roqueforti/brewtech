<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\Module;
use App\Models\Kelas;
use App\Models\Setting;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CertificateController extends Controller
{
    // Fungsi Helper untuk Generate (Dipanggil saat siswa selesai modul/kelas)
    public static function generate($user, $type, $refId, $title)
    {
        // Cek apakah sudah punya sertifikat ini
        $exists = Certificate::where('user_id', $user->id)
            ->where('type', $type)
            ->where('reference_id', $refId)
            ->first();

        if ($exists) return $exists;

        // Buat Kode Unik: BREW-{TYPE}-{USERID}-{REFID}-{RANDOM}
        $code = 'BREW-' . strtoupper(substr($type, 0, 3)) . '-' . 
                str_pad($user->id, 4, '0', STR_PAD_LEFT) . '-' . 
                str_pad($refId, 3, '0', STR_PAD_LEFT) . '-' . 
                strtoupper(Str::random(4));

        return Certificate::create([
            'user_id' => $user->id,
            'certificate_code' => $code,
            'type' => $type,
            'reference_id' => $refId,
            'title' => $title,
            'issued_at' => now(),
        ]);
    }

    // Fungsi Download PDF (Diakses via Route)
    public function download($code)
    {
        $cert = Certificate::where('certificate_code', $code)->with('user')->firstOrFail();

        // Ambil Data Dinamis dari Setting (yang baru kita buat)
        $instructor = Setting::get('instructor_name', 'Instruktur Utama');
        $appName = Setting::get('app_name', 'BrewTech Academy');

        $data = [
            'code' => $cert->certificate_code,
            'student' => $cert->user->name,
            'course' => $cert->title,
            'date' => \Carbon\Carbon::parse($cert->issued_at)->translatedFormat('d F Y'),
            'instructor' => $instructor,
            'app_name' => $appName,
            'type' => $cert->type == 'course' ? 'Kompetensi Keahlian' : 'Penyelesaian Modul'
        ];

        // Load View PDF (Kita buat setelah ini)
        $pdf = Pdf::loadView('pdf.certificate', $data)->setPaper('a4', 'landscape');
        
        return $pdf->stream('Sertifikat-' . $cert->certificate_code . '.pdf');
    }
}