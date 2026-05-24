import Model from 'flarum/common/Model';

export default class ChatMessage extends Model {
  content = Model.attribute('content');
  createdAt = Model.attribute('createdAt', Model.transformDate);
  updatedAt = Model.attribute('updatedAt', Model.transformDate);
  editedAt = Model.attribute('editedAt', Model.transformDate);
  user = Model.hasOne('user');
  editedUser = Model.hasOne('editedUser');
  canDelete = Model.attribute('canDelete');
}
