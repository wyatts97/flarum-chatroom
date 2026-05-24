<?php

declare(strict_types=1);

namespace Wyatts97\Chatroom\Model;

use Flarum\Database\AbstractModel;
use Flarum\User\User;

/**
 * @property int $id
 * @property int $user_id
 * @property string $content
 * @property string|null $ip_address
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \Carbon\Carbon|null $edited_at
 * @property int|null $edited_user_id
 * @property-read User $user
 * @property-read User|null $editedUser
 */
class ChatMessage extends AbstractModel
{
    protected $table = 'chat_messages';

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'edited_at' => 'datetime',
    ];

    protected $fillable = ['user_id', 'content', 'ip_address'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function editedUser()
    {
        return $this->belongsTo(User::class, 'edited_user_id');
    }

    public static function latest(int $limit = 100)
    {
        return static::query()
            ->with(['user', 'editedUser'])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->reverse();
    }

    public static function since(\DateTimeInterface $since, int $limit = 100)
    {
        return static::query()
            ->with(['user', 'editedUser'])
            ->where('created_at', '>', $since)
            ->orderBy('created_at', 'asc')
            ->limit($limit)
            ->get();
    }
}
