import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import Page from 'flarum/common/components/Page';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import type Mithril from 'mithril';

export default class ChatPage extends Page {
  messages: any[] = [];
  loading = true;
  pollingInterval: ReturnType<typeof setInterval> | null = null;
  isAtBottom = true;
  showNewMessagesButton = false;
  hasNewMessages = false;

  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);
    this.loadMessages();
    this.startPolling();
  }

  onremove() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  startPolling() {
    const interval = Number(app.forum.attribute('wyatts97ChatroomPollingInterval')) || 3000;
    this.pollingInterval = setInterval(() => {
      this.loadMessages();
    }, interval);
  }

  loadMessages() {
    const params: Record<string, string> = {
      include: 'user,editedUser',
    };

    app.store
      .find('chatMessages', params)
      .then((results: any[]) => {
        if (results && results.length > 0) {
          const existingIds = new Set(this.messages.map((m) => m.id()));
          const newMessages = results.filter((m) => !existingIds.has(m.id()));
          if (newMessages.length > 0) {
            if (!this.isAtBottom) {
              this.hasNewMessages = true;
              this.showNewMessagesButton = true;
            }
            this.messages.push(...newMessages);
          }
          // Keep within limit
          const limit = Number(app.forum.attribute('wyatts97ChatroomMessageLimit')) || 100;
          if (this.messages.length > limit) {
            this.messages = this.messages.slice(-limit);
          }
        } else if (!this.messages || this.messages.length === 0) {
          this.messages = results || [];
        }
        this.loading = false;
        m.redraw();
      })
      .catch(() => {
        this.loading = false;
        m.redraw();
      });
  }

  view() {
    return (
      <div className="ChatroomPage">
        <div className="container">
          <div className="ChatroomPage-header">
            <h2 className="ChatroomPage-title">
              <i className="fas fa-comments" />
              {app.translator.trans('wyatts97-chatroom.forum.chat.title')}
            </h2>
            <div className="ChatroomPage-status">
              <span className="ChatroomPage-statusDot" />
              {app.translator.trans('wyatts97-chatroom.forum.chat.online_status')}
            </div>
          </div>

          <div className="ChatroomPage-body">
            {this.loading && this.messages.length === 0 ? (
              <LoadingIndicator />
            ) : (
              <ChatMessageList
                messages={this.messages}
                onDelete={(id: string) => this.handleDelete(id)}
                onScrollChange={(isAtBottom: boolean) => {
                  this.isAtBottom = isAtBottom;
                  if (isAtBottom) {
                    this.showNewMessagesButton = false;
                    this.hasNewMessages = false;
                  }
                }}
                showNewMessagesButton={this.showNewMessagesButton}
                onScrollToBottom={() => {
                  this.showNewMessagesButton = false;
                  this.hasNewMessages = false;
                  this.isAtBottom = true;
                }}
              />
            )}
          </div>

          <div className="ChatroomPage-footer">
            <ChatInput onSend={(content: string) => this.sendMessage(content)} />
          </div>
        </div>
      </div>
    );
  }

  sendMessage(content: string) {
    app.store
      .createRecord('chatMessages')
      .save({ content })
      .then((message: any) => {
        this.messages.push(message);
        const limit = Number(app.forum.attribute('wyatts97ChatroomMessageLimit')) || 100;
        if (this.messages.length > limit) {
          this.messages = this.messages.slice(-limit);
        }
        m.redraw();
      })
      .catch((err: any) => {
        alert(err.errors?.[0]?.detail || app.translator.trans('wyatts97-chatroom.forum.chat.send_error'));
      });
  }

  handleDelete(id: string) {
    const message = this.messages.find((m) => m.id() === id);
    if (!message) return;

    if (!confirm(app.translator.trans('wyatts97-chatroom.forum.chat.delete_confirm'))) return;

    app.store
      .deleteRecord(message)
      .then(() => {
        this.messages = this.messages.filter((m) => m.id() !== id);
        m.redraw();
      })
      .catch(() => {
        alert(app.translator.trans('wyatts97-chatroom.forum.chat.delete_error'));
      });
  }
}
