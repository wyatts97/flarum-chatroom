import Extend from 'flarum/common/extenders';
import ChatMessage from './models/ChatMessage';

export default [
  new Extend.Store().add('chatMessages', ChatMessage),
];
