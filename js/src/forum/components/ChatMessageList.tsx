import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import ChatMessageItem from './ChatMessageItem';
import type Mithril from 'mithril';

interface IAttrs {
  messages: any[];
  onScrollChange?: (isAtBottom: boolean) => void;
  showNewMessagesButton?: boolean;
  onScrollToBottom?: () => void;
}

function isSameDay(d1: Date | null, d2: Date | null): boolean {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function formatDateSeparator(date: Date): string {
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(date, now)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';

  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function safeDate(value: any): Date | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export default class ChatMessageList extends Component<IAttrs> {
  container!: HTMLDivElement;
  shouldAutoScroll = true;

  oncreate(vnode: Mithril.VnodeDOM<IAttrs>) {
    this.scrollToBottom();
    this.attachScrollListener();
  }

  onupdate(vnode: Mithril.VnodeDOM<IAttrs>) {
    if (this.shouldAutoScroll) {
      this.scrollToBottom();
    }
  }

  onremove() {
    if (this.container) {
      this.container.removeEventListener('scroll', this.handleScroll);
    }
  }

  attachScrollListener() {
    if (this.container) {
      this.container.addEventListener('scroll', this.handleScroll);
    }
  }

  handleScroll = () => {
    if (!this.container) return;
    const { scrollTop, scrollHeight, clientHeight } = this.container;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    this.shouldAutoScroll = isAtBottom;
    if (this.attrs.onScrollChange) {
      this.attrs.onScrollChange(isAtBottom);
    }
  };

  scrollToBottom(smooth = false) {
    if (this.container) {
      this.container.scrollTo({
        top: this.container.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }

  view(vnode: Mithril.Vnode<IAttrs>) {
    const { messages, showNewMessagesButton, onScrollToBottom } = vnode.attrs;

    if (!messages || messages.length === 0) {
      return (
        <div className="ChatMessageList ChatMessageList--empty">
          <div className="ChatMessageList-placeholder">
            <i className="fas fa-comment-dots ChatMessageList-placeholderIcon" />
            <p>{app.translator.trans('wyatts97-chatroom.forum.chat.no_messages')}</p>
          </div>
        </div>
      );
    }

    let prevUserId: string | null = null;
    let prevDate: Date | null = null;

    return (
      <div className="ChatMessageList-wrapper">
        <div
          className="ChatMessageList"
          ref={(el: HTMLDivElement) => (this.container = el)}
        >
          {messages.map((message, index) => {
            const user = message.user?.() || null;
            const userId = user ? user.id() : null;
            const isGrouped = index > 0 && userId === prevUserId;
            prevUserId = userId;

            const msgDate = safeDate(message.createdAt());
            const showSeparator = msgDate && !isSameDay(msgDate, prevDate);
            if (msgDate) prevDate = msgDate;

            return (
              <div key={message.id()} className="ChatMessageList-item">
                {showSeparator && msgDate && (
                  <div className="ChatMessageList-dateSeparator">
                    <span>{formatDateSeparator(msgDate)}</span>
                  </div>
                )}
                <ChatMessageItem
                  message={message}
                  isGrouped={isGrouped}
                />
              </div>
            );
          })}
        </div>
        {showNewMessagesButton && (
          <button
            className="ChatMessageList-newMessagesButton"
            onclick={() => {
              this.shouldAutoScroll = true;
              this.scrollToBottom(true);
              if (onScrollToBottom) onScrollToBottom();
            }}
          >
            <i className="fas fa-arrow-down" />
            {app.translator.trans('wyatts97-chatroom.forum.chat.new_messages')}
          </button>
        )}
      </div>
    );
  }
}
