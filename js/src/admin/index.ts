import app from 'flarum/admin/app';
import SettingsPage from 'flarum/admin/components/SettingsPage';
import { extend } from 'flarum/common/extend';
import AdminNav from 'flarum/admin/components/AdminNav';

app.initializers.add('acme/chatroom', () => {
  app.extensionData
    .for('acme-chatroom')
    .registerSetting({
      setting: 'acme.chatroom.polling_interval',
      label: app.translator.trans('acme-chatroom.admin.settings.polling_interval_label'),
      type: 'number',
      min: 1000,
      max: 30000,
    })
    .registerSetting({
      setting: 'acme.chatroom.flood_control_seconds',
      label: app.translator.trans('acme-chatroom.admin.settings.flood_control_label'),
      type: 'number',
      min: 0,
      max: 60,
    })
    .registerSetting({
      setting: 'acme.chatroom.max_message_length',
      label: app.translator.trans('acme-chatroom.admin.settings.max_message_length_label'),
      type: 'number',
      min: 100,
      max: 5000,
    })
    .registerSetting({
      setting: 'acme.chatroom.message_limit',
      label: app.translator.trans('acme-chatroom.admin.settings.message_limit_label'),
      type: 'number',
      min: 10,
      max: 500,
    });
});
