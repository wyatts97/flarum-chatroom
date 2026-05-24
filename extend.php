<?php

declare(strict_types=1);

use Acme\Chatroom\Api\Controller\CreateChatMessageController;
use Acme\Chatroom\Api\Controller\DeleteChatMessageController;
use Acme\Chatroom\Api\Controller\ListChatMessagesController;
use Acme\Chatroom\Api\Serializer\ChatMessageSerializer;
use Acme\Chatroom\Model\ChatMessage;
use Acme\Chatroom\Policy\ChatMessagePolicy;
use Acme\Chatroom\Provider\ChatroomServiceProvider;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Extend;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;

return [
    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/less/forum.less')
        ->route('/chat', 'acme.chatroom'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js')
        ->css(__DIR__ . '/less/admin.less'),

    (new Extend\Model(ChatMessage::class))
        ->cast('id', 'int')
        ->cast('user_id', 'int')
        ->cast('created_at', 'datetime')
        ->cast('updated_at', 'datetime'),

    (new Extend\ApiResource(ChatMessage::class))
        ->serializer(ChatMessageSerializer::class),

    (new Extend\Routes('api'))
        ->get('/chat/messages', 'acme.chatroom.messages.index', ListChatMessagesController::class)
        ->post('/chat/messages', 'acme.chatroom.messages.create', CreateChatMessageController::class)
        ->delete('/chat/messages/{id}', 'acme.chatroom.messages.delete', DeleteChatMessageController::class),

    (new Extend\ServiceProvider())
        ->register(ChatroomServiceProvider::class),

    (new Extend\Policy())
        ->modelPolicy(ChatMessage::class, ChatMessagePolicy::class),

    (new Extend\Settings())
        ->default('acme.chatroom.message_limit', 100)
        ->default('acme.chatroom.flood_control_seconds', 5)
        ->default('acme.chatroom.polling_interval', 3000)
        ->default('acme.chatroom.max_message_length', 1000),

    (new Extend\ApiSerializer(ForumSerializer::class))
        ->attributes(function ($serializer, $model, array $attributes): array {
            /** @var SettingsRepositoryInterface $settings */
            $settings = $serializer->getContainer()->make(SettingsRepositoryInterface::class);
            $attributes['acmeChatroomPollingInterval'] = (int) $settings->get('acme.chatroom.polling_interval', 3000);
            $attributes['acmeChatroomMessageLimit'] = (int) $settings->get('acme.chatroom.message_limit', 100);
            $attributes['acmeChatroomMaxMessageLength'] = (int) $settings->get('acme.chatroom.max_message_length', 1000);
            $attributes['acmeChatroomFloodControlSeconds'] = (int) $settings->get('acme.chatroom.flood_control_seconds', 5);
            return $attributes;
        }),

    new Extend\Event(),
];
