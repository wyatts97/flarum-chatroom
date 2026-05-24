import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import type Mithril from 'mithril';

interface IAttrs {
  onSend: (content: string) => void;
}

export default class ChatInput extends Component<IAttrs> {
  value = '';
  sending = false;
  textareaEl!: HTMLTextAreaElement;

  handleSend(onSend: (content: string) => void) {
    const content = this.value.trim();
    if (!content) return;
    this.value = '';
    this.sending = true;
    this.autoGrow();
    onSend(content);
    this.sending = false;
  }

  handleKeydown(e: KeyboardEvent, onSend: (content: string) => void) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.handleSend(onSend);
    }
  }

  autoGrow() {
    if (!this.textareaEl) return;
    this.textareaEl.style.height = 'auto';
    this.textareaEl.style.height = Math.min(this.textareaEl.scrollHeight, 120) + 'px';
  }

  view(vnode: Mithril.Vnode<IAttrs>) {
    const maxLength = Number(app.forum.attribute('wyatts97ChatroomMaxMessageLength')) || 1000;
    const disabled = this.sending || !this.value.trim();

    return (
      <div className="ChatInput">
        <div className="ChatInput-field">
          <textarea
            className="FormControl ChatInput-textarea"
            placeholder={app.translator.trans('wyatts97-chatroom.forum.chat.placeholder')}
            maxlength={maxLength}
            value={this.value}
            oninput={(e: Event) => {
              this.value = (e.target as HTMLTextAreaElement).value;
              this.autoGrow();
            }}
            onkeydown={(e: KeyboardEvent) => this.handleKeydown(e, vnode.attrs.onSend)}
            rows={1}
            ref={(el: HTMLTextAreaElement) => (this.textareaEl = el)}
          />
          <div className="ChatInput-counter">
            {this.value.length}/{maxLength}
          </div>
        </div>
        <button
          className="Button Button--primary ChatInput-send"
          onclick={() => this.handleSend(vnode.attrs.onSend)}
          disabled={disabled}
        >
          <i className="fas fa-paper-plane" />
          {app.translator.trans('wyatts97-chatroom.forum.chat.send')}
        </button>
      </div>
    );
  }
}
