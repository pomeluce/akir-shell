import { Variable, bind } from 'astal';
import Notifd from 'gi://AstalNotifd';
import Box from 'gtk/primitive/Box';
import options from 'options';
import Button from 'gtk/primitive/Button';
import { sleep } from 'core/lib/function';
import Icon from 'gtk/primitive/Icon';
import { Gtk } from 'astal/gtk3';
import Notification from './Notification';

const notifd = Notifd.get_default();
const notifications = bind(notifd, 'notifications').as(ns => ns.filter(n => !options.notifications.blacklist.get().includes(n.appName)));

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
      <Button mx="md" vfill hfill sensitive={notifs.as(l => l > 0)} tooltipText="Clear" flat onClicked={clear}>
        <Box p="xl" gap="lg">
          <label label="Clear" />
          <Icon symbolic icon={icon} css="margin-right:.2em" />
        </Box>
      </Button>
    </revealer>
  );
}

export default function Notifications() {
  const notifs = Variable.derive([notifications, options.notifications.maxItems], (ns, max) => ns.slice(0, max).sort((a, b) => a.time - b.time));

  return (
    <Box vertical className="Notifications" css={options.notifications.width(w => `min-width: ${w}rem`)} p="2xl" vexpand={false}>
      <box className="header" canFocus>
        <label label="Notifications" hexpand xalign={0} />
        <ClearButton />
      </box>
      <Gtk.ScrolledWindow visible>
        <Box vertical>
          <Box visible={notifs().as(n => n.length > 0)} vertical vexpand pt="2xl" gap="xl">
            {notifs(ns =>
              ns.map(n => (
                <box vertical>
                  <Notification notification={n} />
                </box>
              )),
            )}
          </Box>
          <Box vertical vexpand valign={CENTER} halign={CENTER} visible={notifs().as(n => n.length === 0)} gap="md">
            <Icon symbolic icon="notifications-disabled" size={options.notifications.iconSize()} />
            <label label={options.notifications.text()} />
          </Box>
        </Box>
      </Gtk.ScrolledWindow>
    </Box>
  );
}
