<?php

declare(strict_types=1);

namespace Wyatts97\Chatroom\Api\Controller;

use Wyatts97\Chatroom\Model\ChatMessage;
use Flarum\Api\Controller\AbstractListController;
use Flarum\Http\RequestUtil;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ListChatMessagesController extends AbstractListController
{
    public $serializer = \Wyatts97\Chatroom\Api\Serializer\ChatMessageSerializer::class;
    public $include = ['user', 'editedUser'];

    protected function data(ServerRequestInterface $request, Document $document): iterable
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertRegistered();

        $params = $request->getQueryParams();
        $since = $params['since'] ?? null;
        $limit = min((int) ($params['limit'] ?? 50), 100);

        if ($since) {
            $sinceDate = \DateTime::createFromFormat(\DateTime::ATOM, $since);
            return ChatMessage::since($sinceDate, $limit);
        }

        return ChatMessage::latest($limit);
    }
}
