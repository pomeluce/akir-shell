import Icon from 'gtk/primitive/Icon';
import { bind } from 'astal';
import Notifd from 'gi://AstalNotifd';
import PanelButton from '../PanelButton';
import { sh } from 'core/lib/os';
import options from 'options';

export default function Messages() {
  const { flat, action } = options.bar.messages;
  const { blacklist } = options.notifications;
  const notifs = bind(Notifd.get_default(), 'notifications');

  return (
    <PanelButton
      flat={flat()}
      tooltipText={notifs.as(n => `${n.length} notifications`)}
      onClicked={() => sh(action.get())}
      visible={notifs.as(ns => ns.filter(n => !blacklist.get().includes(n.appName)).length > 0)}
    >
      <Icon symbolic icon="chat-bubbles" />
    </PanelButton>
  );
}
