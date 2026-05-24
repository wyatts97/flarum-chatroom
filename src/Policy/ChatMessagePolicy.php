<?php

declare(strict_types=1);

namespace Acme\Chatroom\Policy;

use Acme\Chatroom\Model\ChatMessage;
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
