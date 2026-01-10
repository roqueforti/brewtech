<?php

namespace Database\Seeders;

use App\Models\Workshop;
use App\Models\PraktikumStep; // Pastikan Model ini ada
use App\Models\Question;      // Pastikan Model ini ada
use Illuminate\Database\Seeder;

class V60Seeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat Workshop V60
        $workshop = Workshop::create([
            'title' => 'V60 Manual Brew',
            'subtitle' => 'Teknik Pour Over Dasar',
            'emoji' => '☕',
            'description' => 'Pelajari cara menyeduh kopi yang bersih dan aromatik menggunakan alat V60.',
            'status' => 'active', // Pastikan kolom ini ada atau sesuaikan
            'theme' => ['bg' => 'bg-orange-100', 'border' => 'border-orange-400', 'text' => 'text-orange-900']
        ]);

        // 2. Buat Langkah Praktikum (Step-by-Step)
        $steps = [
            ['title' => 'Persiapan Alat', 'desc' => 'Siapkan V60 dripper, paper filter, server, dan ketel leher angsa. Panaskan air hingga 92°C.', 'img' => 'https://images.unsplash.com/photo-1544979590-7cb526d173ad?auto=format&fit=crop&w=600&q=80'],
            ['title' => 'Bilas Filter', 'desc' => 'Lipat paper filter, letakkan di dripper. Siram dengan air panas untuk menghilangkan bau kertas dan memanaskan alat. Buang air bilasan.', 'img' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80'],
            ['title' => 'Grind & Tuang Kopi', 'desc' => 'Giling 15g biji kopi (medium-fine). Masukkan ke dalam filter, ratakan permukaannya.', 'img' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'],
            ['title' => 'Blooming', 'desc' => 'Tuang 30ml air panas secara memutar. Tunggu 30-45 detik hingga gas CO2 keluar (kopi mengembang).', 'img' => 'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&w=600&q=80'],
            ['title' => 'Pouring Utama', 'desc' => 'Tuang sisa air (total 225ml) secara perlahan dengan gerakan melingkar konstan. Jaga aliran air tetap stabil.', 'img' => 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80'],
            ['title' => 'Selesai', 'desc' => 'Tunggu hingga tetesan terakhir selesai. Angkat dripper, goyangkan server sebentar, dan tuang ke cangkir.', 'img' => 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=600&q=80'],
        ];

        foreach ($steps as $idx => $step) {
            PraktikumStep::create([
                'workshop_id' => $workshop->id,
                'step_order' => $idx + 1,
                'title' => $step['title'],
                'description' => $step['desc'],
                'image_url' => $step['img']
            ]);
        }

        // 3. Buat Soal PRE-TEST (Tentang Alat & Dasar)
        $preQuestions = [
            ['q' => 'Apa fungsi utama membasahi paper filter sebelum menyeduh?', 'opsi' => ['Agar kopi lebih manis', 'Menghilangkan bau kertas', 'Mendinginkan alat', 'Agar air cepat turun'], 'ans' => 'B'],
            ['q' => 'Berapa suhu air ideal untuk V60 umumnya?', 'opsi' => ['100°C (Mendidih)', '70°C - 80°C', '90°C - 96°C', '50°C'], 'ans' => 'C'],
            ['q' => 'Ukuran gilingan (grind size) yang cocok untuk V60 adalah?', 'opsi' => ['Sangat Halus (Seperti bedak)', 'Medium-Fine (Seperti garam meja)', 'Kasar (Seperti garam laut)', 'Utuh (Biji)'], 'ans' => 'B'],
        ];

        foreach ($preQuestions as $q) {
            Question::create([
                'workshop_id' => $workshop->id,
                'question_text' => $q['q'],
                'options' => $q['opsi'], // Pastikan di Model Question ada cast 'options' => 'array'
                'correct_answer' => $q['ans'],
                'type' => 'pretest'
            ]);
        }

        // 4. Buat Soal POST-TEST (Tentang Proses)
        $postQuestions = [
            ['q' => 'Apa nama proses saat kopi melepaskan gas CO2 di awal penyeduhan?', 'opsi' => ['Extraction', 'Blooming', 'Dripping', 'Filtering'], 'ans' => 'B'],
            ['q' => 'Jika rasa kopi terlalu pahit, apa yang mungkin salah?', 'opsi' => ['Gilingan terlalu kasar', 'Gilingan terlalu halus', 'Air terlalu dingin', 'Waktu seduh terlalu cepat'], 'ans' => 'B'],
            ['q' => 'Gerakan menuang air yang disarankan adalah?', 'opsi' => ['Satu titik di tengah', 'Acak sembarangan', 'Melingkar (Spiral) perlahan', 'Mengenai dinding kertas'], 'ans' => 'C'],
        ];

        foreach ($postQuestions as $q) {
            Question::create([
                'workshop_id' => $workshop->id,
                'question_text' => $q['q'],
                'options' => $q['opsi'],
                'correct_answer' => $q['ans'],
                'type' => 'posttest'
            ]);
        }
    }
}