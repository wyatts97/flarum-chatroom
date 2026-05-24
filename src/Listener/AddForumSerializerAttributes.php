<?php

declare(strict_types=1);

namespace Wyatts97\Chatroom\Listener;

use Flarum\Api\Event\Serializing;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Settings\SettingsRepositoryInterface;

class AddForumSerializerAttributes
{
    public function __construct(
        protected SettingsRepositoryInterface $settings
    ) {
    }

    public function handle(Serializing $event): void
    {
        if ($event->isSerializer(ForumSerializer::class)) {
            $event->attributes['wyatts97ChatroomPollingInterval'] = (int) $this->settings->get('wyatts97.chatroom.polling_interval', 3000);
            $event->attributes['wyatts97ChatroomMessageLimit'] = (int) $this->settings->get('wyatts97.chatroom.message_limit', 100);
            $event->attributes['wyatts97ChatroomMaxMessageLength'] = (int) $this->settings->get('wyatts97.chatroom.max_message_length', 1000);
            $event->attributes['wyatts97ChatroomFloodControlSeconds'] = (int) $this->settings->get('wyatts97.chatroom.flood_control_seconds', 5);
        }
    }
}
