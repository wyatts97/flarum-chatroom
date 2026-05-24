<?php

declare(strict_types=1);

namespace Acme\Chatroom\Event;

use Acme\Chatroom\Model\ChatMessage;
use Flarum\User\User;

class ChatMessagePosted
{
    public function __construct(
        public readonly ChatMessage $message,
        public readonly User $actor
    ) {
    }
}
