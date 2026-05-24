import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import humanTime from 'flarum/common/helpers/humanTime';
import username from 'flarum/common/helpers/username';
import avatar from 'flarum/common/helpers/avatar';
import type Mithril from 'mithril';

interface IAttrs {
  message: any;
  onDelete: (id: string) => void;
}

export default class ChatMessageItem extends Component<IAttrs> {
  view(vnode: Mithril.Vnode<IAttrs>) {
    const { message, onDelete } = vnode.attrs;
    const user = message.user?.() || null;
    const currentUser = app.session.user;
    const isMe = currentUser && user && currentUser.id() === user.id();
    const canDelete = message.canDelete?.() ?? false;

    return (
      <div className={`ChatMessageItem ${isMe ? 'ChatMessageItem--me' : ''}`}>
        <div className="ChatMessageItem-avatar">
          {user ? avatar(user, { size: 40 }) : <div className="Avatar" />}
        </div>
        <div className="ChatMessageItem-content">
          <div className="ChatMessageItem-meta">
            <span className="ChatMessageItem-author">{user ? username(user) : app.translator.trans('core.lib.username.deleted_text')}</span>
            <span className="ChatMessageItem-time">{humanTime(message.createdAt())}</span>
            {message.editedAt() && (
              <span className="ChatMessageItem-edited" title={message.editedAt()}>
                {app.translator.trans('wyatts97-chatroom.forum.chat.edited')}
              </span>
            )}
          </div>
          <div className="ChatMessageItem-bubble">
            <div className="ChatMessageItem-text">{message.content()}</div>
            {canDelete && (
              <button
                className="Button Button--icon Button--link ChatMessageItem-delete"
                onclick={() => onDelete(message.id())}
                title={app.translator.trans('wyatts97-chatroom.forum.chat.delete')}
              >
                <i className="fas fa-trash" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}
