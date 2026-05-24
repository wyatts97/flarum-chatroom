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

  scrollToBottom() {
    if (this.container) {
      this.container.scrollTop = this.container.scrollHeight;
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
            return (
              <ChatMessageItem
                key={message.id()}
                message={message}
                isGrouped={isGrouped}
              />
            );
          })}
        </div>
        {showNewMessagesButton && (
          <button
            className="ChatMessageList-newMessagesButton"
            onclick={() => {
              this.shouldAutoScroll = true;
              this.scrollToBottom();
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
