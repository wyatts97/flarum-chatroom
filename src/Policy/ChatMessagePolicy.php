<?php

declare(strict_types=1);

namespace Wyatts97\Chatroom\Policy;

use Wyatts97\Chatroom\Model\ChatMessage;
use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;

class ChatMessagePolicy extends AbstractPolicy
{
    public function edit(User $actor, ChatMessage $message): bool
    {
        return $actor->id === $message->user_id || $actor->isAdmin();
    }

    public function delete(User $actor, ChatMessage $message): bool
    {
        return $actor->id === $message->user_id || $actor->isAdmin();
    }
}
