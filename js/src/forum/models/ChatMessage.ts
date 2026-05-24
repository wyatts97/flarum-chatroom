import Model from 'flarum/common/Model';

export default class ChatMessage extends Model {
  content() {
    return this.attribute('content');
  }

  createdAt() {
    return this.attribute('createdAt');
  }

  updatedAt() {
    return this.attribute('updatedAt');
  }

  editedAt() {
    return this.attribute('editedAt');
  }

  user() {
    return this.belongsTo('users');
  }

  editedUser() {
    return this.belongsTo('users', 'editedUser');
  }

  canDelete() {
    return this.attribute('canDelete');
  }
}
