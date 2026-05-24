<?php

declare(strict_types=1);

namespace Wyatts97\Chatroom\Api\Resource;

use Carbon\Carbon;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource\AbstractDatabaseResource;
use Flarum\Api\Schema;
use Flarum\Api\Sort\SortColumn;
use Flarum\Foundation\ValidationException;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Tobyz\JsonApiServer\Context;
use Wyatts97\Chatroom\Event\ChatMessagePosted;
use Wyatts97\Chatroom\Model\ChatMessage;

/**
 * @extends AbstractDatabaseResource<ChatMessage>
 */
class ChatMessageResource extends AbstractDatabaseResource
{
    public function __construct(
        protected SettingsRepositoryInterface $settings,
        protected Dispatcher $events
    ) {
    }

    public function type(): string
    {
        return 'chatMessages';
    }

    public function model(): string
    {
        return ChatMessage::class;
    }

    public function scope(Builder $query, Context $context): void
    {
        // All registered users can view chat messages
        $query->whereHas('user');
    }

    public function endpoints(): array
    {
        return [
            Endpoint\Index::make()
                ->defaultInclude(['user', 'editedUser'])
                ->defaultSort('-createdAt')
                ->paginate(50, 100)
                ->authenticated(),
            Endpoint\Create::make()
                ->authenticated(),
            Endpoint\Delete::make()
                ->authenticated()
                ->can('deleteChatMessage'),
        ];
    }

    public function sorts(): array
    {
        return [
            SortColumn::make('createdAt'),
        ];
    }

    public function fields(): array
    {
        return [
            Schema\Str::make('content')
                ->requiredOnCreate()
                ->writable()
                ->maxLength(1000),
            Schema\DateTime::make('createdAt'),
            Schema\DateTime::make('updatedAt'),
            Schema\DateTime::make('editedAt')
                ->nullable(),
            Schema\Relationship\ToOne::make('user')
                ->type('users')
                ->includable(),
            Schema\Relationship\ToOne::make('editedUser')
                ->type('users')
                ->includable(),
        ];
    }

    public function creating(object $model, Context $context): ?object
    {
        /** @var ChatMessage $model */
        $actor = $context->getActor();

        if (! $actor->isRegisteredUser()) {
            throw new ValidationException(['content' => ['You must be logged in to send messages.']]);
        }

        $content = trim((string) $model->content);

        $maxLength = (int) $this->settings->get('wyatts97.chatroom.max_message_length', 1000);
        if (mb_strlen($content) === 0) {
            throw new ValidationException(['content' => ['The message cannot be empty.']]);
        }
        if (mb_strlen($content) > $maxLength) {
            throw new ValidationException(['content' => ["The message may not be longer than {$maxLength} characters."]]);
        }

        $floodSeconds = (int) $this->settings->get('wyatts97.chatroom.flood_control_seconds', 5);
        if ($floodSeconds > 0) {
            $latest = ChatMessage::query()
                ->where('user_id', $actor->id)
                ->orderBy('created_at', 'desc')
                ->first();

            if ($latest && $latest->created_at && $latest->created_at->diffInSeconds(Carbon::now()) < $floodSeconds) {
                throw new ValidationException(['content' => ['Please wait a moment before sending another message.']]);
            }
        }

        $model->user_id = $actor->id;
        $model->ip_address = $context->request->getServerParams()['REMOTE_ADDR'] ?? null;

        return null;
    }

    public function created(object $model, Context $context): ?object
    {
        /** @var ChatMessage $model */
        $this->events->dispatch(new ChatMessagePosted($model, $context->getActor()));

        return null;
    }
}
