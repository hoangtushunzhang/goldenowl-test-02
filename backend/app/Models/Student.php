<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'registration_number',
        'name',
        'group',
    ];

    public function scores()
    {
        return $this->hasMany(Score::class);
    }

    public function getAverageScore()
    {
        return $this->scores()->avg('score');
    }
}