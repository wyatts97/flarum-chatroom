<?php

declare(strict_types=1);

namespace Wyatts97\Chatroom\Event;

use Wyatts97\Chatroom\Model\ChatMessage;
use Flarum\User\User;

class ChatMessagePosted
{
    public function __construct(
        public readonly ChatMessage $message,
        public readonly User $actor
    ) {
    }
}
