import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import HeaderPrimary from 'flarum/forum/components/HeaderPrimary';
import LinkButton from 'flarum/common/components/LinkButton';
import ChatPage from './components/ChatPage';

app.initializers.add('acme/chatroom', () => {
  app.routes['acme.chatroom'] = {
    path: '/chat',
    component: ChatPage,
  };

  extend(HeaderPrimary.prototype, 'items', function (items) {
    if (app.session.user) {
      items.add(
        'chatroom',
        <LinkButton
          icon="fas fa-comments"
          href={app.route('acme.chatroom')}
          active={app.current.matches('acme.chatroom')}
        >
          {app.translator.trans('acme-chatroom.forum.nav.chat_link')}
        </LinkButton>,
        20
      );
    }
  });
});
