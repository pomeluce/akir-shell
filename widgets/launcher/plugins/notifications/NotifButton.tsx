import { App } from 'astal/gtk3';
import { bind } from 'astal';
import Notifd from 'gi://AstalNotifd';
import { sleep } from 'core/lib/function';
import Button from 'gtk/primitive/Button';
import Box from 'gtk/primitive/Box';
import ToggleButton from 'gtk/primitive/ToggleButton';
import Icon from 'gtk/primitive/Icon';

function DND() {
  const notifd = Notifd.get_default();
  return (
    <ToggleButton suggested color="primary" vfill mx="md" state={bind(notifd, 'dontDisturb')} onToggled={() => (notifd.dontDisturb = !notifd.dontDisturb)}>
      <Box px="xl" vexpand>
        <Icon symbolic icon={bind(notifd, 'dontDisturb').as(dnd => (dnd ? 'notifications-disabled' : 'preferences-system-notifications'))} />
      </Box>
    </ToggleButton>
  );
}

function ClearButton() {
  const notifd = Notifd.get_default();
  const notifs = bind(notifd, 'notifications').as(ns => ns.length);
  const icon = notifs.as(l => (l > 0 ? 'user-trash-full' : 'user-trash'));

  async function clear() {
    while (notifd.get_notifications().length > 0) {
      notifd.get_notifications()[0]?.dismiss();
      await sleep(100);
    }
    App.get_window('launcher')!.visible = false;
  }

  return (
    <revealer revealChild={notifs.as(l => l > 0)} transitionType={SLIDE_LEFT}>
      <Button mx="md" vfill hfill sensitive={notifs.as(l => l > 0)} tooltipText="Clear" flat suggested color="error" onClicked={clear}>
        <Box px="xl">
          <Icon symbolic icon={icon} css="margin-right:.2em" />
          Clear
        </Box>
      </Button>
    </revealer>
  );
}

export default function NotifButton() {
  return (
    <box>
      <DND />
      <ClearButton />
    </box>
  );
}
