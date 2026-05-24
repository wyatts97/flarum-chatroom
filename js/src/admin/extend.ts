import Extend from 'flarum/common/extenders';
import app from 'flarum/admin/app';

export default [
  new Extend.Admin()
    .setting(
      () => ({
        setting: 'wyatts97.chatroom.polling_interval',
        label: app.translator.trans('wyatts97-chatroom.admin.settings.polling_interval_label'),
        type: 'number',
        min: 1000,
        max: 30000,
      }),
      10
    )
    .setting(
      () => ({
        setting: 'wyatts97.chatroom.flood_control_seconds',
        label: app.translator.trans('wyatts97-chatroom.admin.settings.flood_control_label'),
        type: 'number',
        min: 0,
        max: 60,
      }),
      20
    )
    .setting(
      () => ({
        setting: 'wyatts97.chatroom.max_message_length',
        label: app.translator.trans('wyatts97-chatroom.admin.settings.max_message_length_label'),
        type: 'number',
        min: 100,
        max: 5000,
      }),
      30
    )
    .setting(
      () => ({
        setting: 'wyatts97.chatroom.message_limit',
        label: app.translator.trans('wyatts97-chatroom.admin.settings.message_limit_label'),
        type: 'number',
        min: 10,
        max: 500,
      }),
      40
    ),
];
