import AstalNotifd from 'gi://AstalNotifd?version=0.1';
import NotificationItem from './notification-item';
import { Box, Button, Icon } from '@/components';
import { Gtk } from 'ags/gtk4';
import { createBinding, createComputed, For } from 'gnim';
import { configs } from 'options';
import { sleep } from '@/support/function';

const { blacklist, maxItems, iconSize, text, width } = configs.notifications;

const notifd = AstalNotifd.get_default();
const notifications = createBinding(notifd, 'notifications').as(ns => ns.filter(n => !blacklist.peek().includes(n.appName)));

function ClearButton() {
  const notifs = notifications.as(ns => ns.length);
  const icon = notifs.as(l => (l > 0 ? 'user-trash-full' : 'user-trash'));

  async function clear() {
    while (notifd.get_notifications().length > 0) {
      notifd.get_notifications()[0]?.dismiss();
      await sleep(100);
    }
  }

  return (
    <revealer revealChild={notifs.as(l => l > 0)} transitionType={SLIDE_LEFT}>
      <Button px="md" vfill hfill sensitive={notifs.as(l => l > 0)} tooltipText="Clear" flat onClicked={clear}>
        <Box p="xl" gap="lg">
          <label label="Clear" />
          <Icon symbolic iconName={icon} css="margin-right:.2em;" />
        </Box>
      </Button>
    </revealer>
  );
}

export default () => {
  const notifs = createComputed(() =>
    notifications()
      .slice(0, maxItems())
      .sort((a, b) => a.time - b.time),
  );

  return (
    <Box vertical class="notifications" css={width(w => `min-width: ${w}rem;`)} p="2xl" vexpand={false}>
      <box class="header" canFocus>
        <label label="Notifications" hexpand xalign={0} />
        <ClearButton />
      </box>
      <scrolledwindow visible>
        <Box vertical>
          <Box visible={notifs.as(n => n.length > 0)} vertical vexpand pt="2xl" gap="xl">
            <For each={notifs}>
              {n => (
                <box orientation={Gtk.Orientation.VERTICAL}>
                  <NotificationItem notification={n} />
                </box>
              )}
            </For>
          </Box>
          <Box vertical vexpand valign={CENTER} halign={CENTER} visible={notifs.as(n => n.length === 0)} gap="md">
            <Icon symbolic iconName="notifications-disabled" pixelSize={iconSize(i => i * 10)} />
            <label label={text} />
          </Box>
        </Box>
      </scrolledwindow>
    </Box>
  );
};
