<?php

declare(strict_types=1);

namespace Acme\Chatroom\Provider;

use Flarum\Foundation\AbstractServiceProvider;

class ChatroomServiceProvider extends AbstractServiceProvider
{
    public function register(): void
    {
        // Register websocket broadcasters or custom services here.
        // Example: $this->container->singleton(ChatBroadcaster::class);
    }

    public function boot(): void
    {
        // Boot event listeners or scheduled tasks here.
    }
}
