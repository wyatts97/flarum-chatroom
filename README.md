# Flarum Chatroom Extension

A real-time chatroom extension for Flarum v2.x.

## Features

- **Mithril Frontend** — Built with TypeScript and Mithril JSX components.
- **JSON:API Backend** — Full Flarum JSON:API integration with proper serializers.
- **MySQL Storage** — Messages stored in a dedicated `chat_messages` table.
- **Logged-in Only** — Chatroom accessible only to registered users.
- **Polling MVP** — Configurable polling interval for live message updates.
- **Websocket-Ready** — Event architecture (`ChatMessagePosted`) ready for Pusher/WebSocket integration.
- **Modern Responsive UI** — Mobile-friendly design with auto-scroll and clean aesthetics.
- **Flood Control & Limits** — Configurable rate limiting, max message length, and history limit.

## Requirements

- PHP >= 8.2
- Flarum >= 2.0.0-rc.1
- MySQL / MariaDB

## Installation

```bash
composer require wyatts97/flarum-chatroom
php flarum migrate
php flarum cache:clear
```

## Build Frontend

```bash
cd js
npm install
npm run build
```

## Admin Settings

- **Polling interval** — How often to poll for new messages (ms).
- **Flood control** — Minimum seconds between messages from the same user.
- **Max message length** — Character limit per message.
- **Message history limit** — How many messages to load at once.

## API Endpoints

| Method | Endpoint | Action |
|--------|----------|--------|
| GET | `/api/chat/messages` | List messages |
| POST | `/api/chat/messages` | Send message |
| DELETE | `/api/chat/messages/{id}` | Delete message |

## WebSocket Upgrade Path

The `ChatMessagePosted` event is dispatched on every new message. To switch from polling to WebSocket:

1. Listen to `ChatMessagePosted` in a service provider.
2. Broadcast the payload via Pusher, Ably, or Laravel Echo.
3. On the frontend, replace the `setInterval` polling in `ChatPage.tsx` with a WebSocket subscription.

## License

MIT
