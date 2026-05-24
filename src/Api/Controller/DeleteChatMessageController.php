<?php

declare(strict_types=1);

namespace Wyatts97\Chatroom\Api\Controller;

use Wyatts97\Chatroom\Model\ChatMessage;
use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;

class DeleteChatMessageController extends AbstractDeleteController
{
    protected function delete(ServerRequestInterface $request)
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertRegistered();

        $id = Arr::get($request->getQueryParams(), 'id');
        $message = ChatMessage::findOrFail($id);

        $actor->assertCan('delete', $message);

        $message->delete();
    }
}
