<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ScoreController;

Route::get('/check-score', [ScoreController::class, 'checkScore']);
Route::get('/score-report', [ScoreController::class, 'getScoreReport']);
Route::get('/top-students', [ScoreController::class, 'getTopStudents']); 