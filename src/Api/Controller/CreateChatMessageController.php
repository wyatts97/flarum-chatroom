<?php

declare(strict_types=1);

namespace Wyatts97\Chatroom\Api\Controller;

use Wyatts97\Chatroom\Event\ChatMessagePosted;
use Wyatts97\Chatroom\Model\ChatMessage;
use Carbon\Carbon;
use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Foundation\ValidationException;
use Flarum\Http\RequestUtil;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class CreateChatMessageController extends AbstractCreateController
{
    public $serializer = \Wyatts97\Chatroom\Api\Serializer\ChatMessageSerializer::class;
    public $include = ['user'];

    public function __construct(
        protected SettingsRepositoryInterface $settings,
        protected Dispatcher $events
    ) {
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertRegistered();

        $data = $request->getParsedBody()['data'] ?? [];
        $attributes = Arr::get($data, 'attributes', []);
        $content = trim((string) Arr::get($attributes, 'content', ''));

        $maxLength = (int) $this->settings->get('wyatts97.chatroom.max_message_length', 1000);
        if (mb_strlen($content) === 0) {
            throw new ValidationException(['message' => ['The message cannot be empty.']]);
        }
        if (mb_strlen($content) > $maxLength) {
            throw new ValidationException(['message' => ["The message may not be longer than {$maxLength} characters."]]);
        }

        $floodSeconds = (int) $this->settings->get('wyatts97.chatroom.flood_control_seconds', 5);
        if ($floodSeconds > 0) {
            $latest = ChatMessage::query()
                ->where('user_id', $actor->id)
                ->orderBy('created_at', 'desc')
                ->first();

            if ($latest && $latest->created_at->diffInSeconds(Carbon::now()) < $floodSeconds) {
                throw new ValidationException(['message' => ['Please wait a moment before sending another message.']]);
            }
        }

        $message = ChatMessage::create([
            'user_id' => $actor->id,
            'content' => $content,
            'ip_address' => $request->getServerParams()['REMOTE_ADDR'] ?? null,
        ]);

        $message->load('user');

        $this->events->dispatch(new ChatMessagePosted($message, $actor));

        return $message;
    }
}
