import Icon from 'gtk/primitive/Icon';
import { bind } from 'astal';
import Notifd from 'gi://AstalNotifd';
import PanelButton from '../PanelButton';
import options from '../options';
import { sh } from 'core/lib/os';

export default function Messages() {
  const { flat, action } = options.messages;
  const notifs = bind(Notifd.get_default(), 'notifications');

  return (
    <PanelButton flat={flat()} tooltipText={notifs.as(n => `${n.length} notifications`)} onClicked={() => sh(action.get())} visible={notifs.as(ns => ns.length > 0)}>
      <Icon symbolic icon="chat-bubbles" />
    </PanelButton>
  );
}
