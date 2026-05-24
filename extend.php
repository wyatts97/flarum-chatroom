<?php

declare(strict_types=1);

use Wyatts97\Chatroom\Api\Resource\ChatMessageResource;
use Wyatts97\Chatroom\Listener\AddForumSerializerAttributes;
use Wyatts97\Chatroom\Model\ChatMessage;
use Wyatts97\Chatroom\Policy\ChatMessagePolicy;
use Wyatts97\Chatroom\Provider\ChatroomServiceProvider;
use Flarum\Api\Event\Serializing;
use Flarum\Extend;

return [
    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/less/forum.less')
        ->route('/chat', 'wyatts97.chatroom'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js')
        ->css(__DIR__ . '/less/admin.less'),

    (new Extend\Model(ChatMessage::class))
        ->cast('id', 'int')
        ->cast('user_id', 'int')
        ->cast('created_at', 'datetime')
        ->cast('updated_at', 'datetime'),

    (new Extend\ApiResource(ChatMessageResource::class)),

    (new Extend\ServiceProvider())
        ->register(ChatroomServiceProvider::class),

    (new Extend\Policy())
        ->modelPolicy(ChatMessage::class, ChatMessagePolicy::class),

    (new Extend\Settings())
        ->default('wyatts97.chatroom.message_limit', 100)
        ->default('wyatts97.chatroom.flood_control_seconds', 5)
        ->default('wyatts97.chatroom.polling_interval', 3000)
        ->default('wyatts97.chatroom.max_message_length', 1000),

    (new Extend\Event())
        ->listen(Serializing::class, AddForumSerializerAttributes::class),
];
