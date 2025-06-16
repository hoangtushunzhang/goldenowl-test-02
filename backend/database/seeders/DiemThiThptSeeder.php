<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DiemThiThptSeeder extends Seeder
{
    public function run()
    {
        $csvPath = database_path('data/diem_thi_thpt_2024.csv');
        if (!file_exists($csvPath)) {
            $this->command->error("File CSV không tồn tại: $csvPath");
            return;
        }

      
        if (($handle = fopen($csvPath, 'r')) !== false) {
            $header = fgetcsv($handle);
            while (($row = fgetcsv($handle)) !== false) {
                $data = array_combine($header, $row);
                
                
                $processScore = function($value) {
                    return (is_numeric($value) && trim($value) !== '') ? (float)$value : null;
                };

                DB::table('diem_thi_thpt')->insert([
                    'sbd' => $data['sbd'],
                    'toan' => $processScore($data['toan']),
                    'ngu_van' => $processScore($data['ngu_van']),
                    'ngoai_ngu' => $processScore($data['ngoai_ngu']),
                    'vat_li' => $processScore($data['vat_li']),
                    'hoa_hoc' => $processScore($data['hoa_hoc']),
                    'sinh_hoc' => $processScore($data['sinh_hoc']),
                    'lich_su' => $processScore($data['lich_su']),
                    'dia_li' => $processScore($data['dia_li']),
                    'gdcd' => $processScore($data['gdcd']),
                    'ma_ngoai_ngu' => !empty($data['ma_ngoai_ngu']) ? $data['ma_ngoai_ngu'] : null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
            fclose($handle);
        }
    }
} 