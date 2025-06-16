<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ScoreController extends Controller
{
    public function checkScore(Request $request)
    {
        $request->validate([
            'registration_number' => 'required|string|size:8'
        ]);

        $score = DB::table('diem_thi_thpt')
            ->where('sbd', $request->registration_number)
            ->first();

        if (!$score) {
            return response()->json(['message' => 'Không tìm thấy thông tin thí sinh'], 404);
        }

        return response()->json($score);
    }

    public function getScoreReport()
    {
        $subjects = ['toan', 'vat_li', 'hoa_hoc', 'sinh_hoc', 'ngu_van', 'lich_su', 'dia_li', 'gdcd', 'ngoai_ngu'];
        $report = [];

        // Tạo một truy vấn duy nhất cho tất cả các môn học
        $query = "SELECT ";
        foreach ($subjects as $subject) {
            $query .= "
                COUNT(CASE WHEN $subject >= 8 THEN 1 END) as {$subject}_excellent,
                COUNT(CASE WHEN $subject >= 6 AND $subject < 8 THEN 1 END) as {$subject}_good,
                COUNT(CASE WHEN $subject >= 4 AND $subject < 6 THEN 1 END) as {$subject}_average,
                COUNT(CASE WHEN $subject < 4 THEN 1 END) as {$subject}_poor,";
        }
        $query = rtrim($query, ',');
        $query .= " FROM diem_thi_thpt";

        $stats = DB::select($query)[0];

        // Chuyển đổi kết quả thành định dạng mong muốn
        foreach ($subjects as $subject) {
            $report[$subject] = [
                'excellent' => (int)$stats->{"{$subject}_excellent"},
                'good' => (int)$stats->{"{$subject}_good"},
                'average' => (int)$stats->{"{$subject}_average"},
                'poor' => (int)$stats->{"{$subject}_poor"},
            ];
        }

        return response()->json($report);
    }

    public function getTopStudents()
    {
        $topStudents = DB::table('diem_thi_thpt')
            ->select('sbd', 'toan', 'vat_li', 'hoa_hoc')
            ->whereNotNull(['toan', 'vat_li', 'hoa_hoc'])
            ->orderByRaw('(toan + vat_li + hoa_hoc) DESC')
            ->limit(10)
            ->get();

        return response()->json($topStudents);
    }
}