<?php
class ClassAssignment extends Model
{
    protected $fillable = [
        'class_id',
        'workshop_id',
        'assigned_at',
        'due_date',
        'is_active'
    ];

    public function class()
    {
        return $this->belongsTo(ClassRoom::class);
    }

    public function workshop()
    {
        return $this->belongsTo(Workshop::class);
    }
}
