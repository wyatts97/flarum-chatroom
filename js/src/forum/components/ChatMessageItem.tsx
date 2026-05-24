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

function safeDate(value: any): Date | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function formatShortTime(date: Date | null): string {
  if (!date) return '';
  try {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '';
  }
}

function formatDateTitle(date: Date | null): string {
  if (!date) return '';
  try {
    return date.toLocaleString();
  } catch (e) {
    return '';
  }
}

export default class ChatMessageItem extends Component<IAttrs> {
  view(vnode: Mithril.Vnode<IAttrs>) {
    const { message, onDelete, isGrouped } = vnode.attrs;
    const user = message.user?.() || null;
    const currentUser = app.session.user;
    const canDelete = currentUser && user && (currentUser.id() === user.id() || currentUser.isAdmin());
    const createdAt = safeDate(message.createdAt());
    const editedAt = safeDate(message.editedAt());
    const shortTime = formatShortTime(createdAt);

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
            <span className="ChatMessageItem-time">{createdAt ? humanTime(createdAt) : ''}</span>
            {editedAt && (
              <span className="ChatMessageItem-edited" title={formatDateTitle(editedAt)}>
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
