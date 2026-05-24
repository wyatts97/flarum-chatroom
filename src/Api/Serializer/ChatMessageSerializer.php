<?php

declare(strict_types=1);

namespace Wyatts97\Chatroom\Api\Serializer;

use Wyatts97\Chatroom\Model\ChatMessage;
use Flarum\Api\Serializer\AbstractSerializer;
use Flarum\Api\Serializer\BasicUserSerializer;

class ChatMessageSerializer extends AbstractSerializer
{
    protected $type = 'chatMessages';

    /**
     * @param ChatMessage $model
     */
    protected function getDefaultAttributes($model): array
    {
        return [
            'content' => $model->content,
            'createdAt' => $this->formatDate($model->created_at),
            'updatedAt' => $this->formatDate($model->updated_at),
            'editedAt' => $model->edited_at ? $this->formatDate($model->edited_at) : null,
            'canEdit' => $this->actor->can('edit', $model),
            'canDelete' => $this->actor->can('delete', $model),
        ];
    }

    public function user($model)
    {
        return $this->hasOne($model, BasicUserSerializer::class);
    }

    public function editedUser($model)
    {
        return $this->hasOne($model, BasicUserSerializer::class);
    }
}
