import Component from 'flarum/common/Component';
import ChatMessageItem from './ChatMessageItem';
import type Mithril from 'mithril';

interface IAttrs {
  messages: any[];
  onDelete: (id: string) => void;
}

export default class ChatMessageList extends Component<IAttrs> {
  listEnd!: HTMLDivElement;

  oncreate(vnode: Mithril.VnodeDOM<IAttrs>) {
    this.scrollToBottom();
  }

  onupdate(vnode: Mithril.VnodeDOM<IAttrs>) {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.listEnd) {
      this.listEnd.scrollIntoView({ behavior: 'smooth' });
    }
  }

  view(vnode: Mithril.Vnode<IAttrs>) {
    const { messages, onDelete } = vnode.attrs;

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

    return (
      <div className="ChatMessageList">
        {messages.map((message) => (
          <ChatMessageItem key={message.id()} message={message} onDelete={onDelete} />
        ))}
        <div ref={(el: HTMLDivElement) => (this.listEnd = el)} />
      </div>
    );
  }
}
