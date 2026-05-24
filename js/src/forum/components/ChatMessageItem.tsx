import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import humanTime from 'flarum/common/helpers/humanTime';
import username from 'flarum/common/helpers/username';
import Avatar from 'flarum/common/components/Avatar';
import type Mithril from 'mithril';

interface IAttrs {
  message: any;
  onDelete: (id: string) => void;
  isGrouped: boolean;
}

export default class ChatMessageItem extends Component<IAttrs> {
  view(vnode: Mithril.Vnode<IAttrs>) {
    const { message, onDelete, isGrouped } = vnode.attrs;
    const user = message.user?.() || null;
    const canDelete = message.canDelete?.() ?? false;
    const createdAt = message.createdAt();
    const shortTime = createdAt ? new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    if (isGrouped) {
      return (
        <div className="ChatMessageItem ChatMessageItem--grouped">
          <div className="ChatMessageItem-hoverTime">{shortTime}</div>
          <div className="ChatMessageItem-content">
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

    return (
      <div className="ChatMessageItem">
        <div className="ChatMessageItem-avatar">
          {user ? <Avatar user={user} size={40} /> : <div className="Avatar" />}
        </div>
        <div className="ChatMessageItem-content">
          <div className="ChatMessageItem-meta">
            <span className="ChatMessageItem-author">
              {user ? username(user) : app.translator.trans('core.lib.username.deleted_text')}
            </span>
            <span className="ChatMessageItem-time">{humanTime(createdAt)}</span>
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
