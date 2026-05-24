<?php

declare(strict_types=1);

namespace Wyatts97\Chatroom\Policy;

use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;

class ChatMessagePolicy extends AbstractPolicy
{
    public function createChatMessage(User $actor): bool
    {
        return $actor->isRegisteredUser();
    }
}
