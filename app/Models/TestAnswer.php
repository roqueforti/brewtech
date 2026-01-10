<?php
class TestAnswer extends Model
{
    protected $fillable = [
        'student_id',
        'workshop_id',
        'question_id',
        'test_type',
        'selected_answer',
        'is_correct',
        'answered_at'
    ];

    protected $casts = [
        'is_correct' => 'boolean'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
