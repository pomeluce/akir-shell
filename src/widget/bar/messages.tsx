import AstalNotifd from 'gi://AstalNotifd';
import PanelButton from './panel-button';
import Icon from '@/components/icon';
import { createBinding } from 'gnim';
import { sh } from '@/support/os';
import options from 'options';

export default () => {
  const notifd = AstalNotifd.get_default();
  const { flat, action } = options.bar.messages;
  const { blacklist } = options.notifications;
  const notifs = createBinding(notifd, 'notifications');

  return (
    <PanelButton
      flat={flat()}
      tooltipText={notifs.as(n => `${n.length} notifications`)}
      onClicked={() => sh(action.get())}
      visible={notifs.as(ns => ns.filter(n => !blacklist.get().includes(n.appName)).length > 0)}
    >
      <Icon symbolic iconName="chat-bubbles" />
    </PanelButton>
  );
};
