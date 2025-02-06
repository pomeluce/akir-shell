import { App, Astal, Gdk, Widget } from 'astal/gtk3';
import { idle, timeout } from 'astal/time';
import Notifd from 'gi://AstalNotifd';
import options from './options';
import PopupBin from 'gtk/primitive/PopupBin';
import Box from 'gtk/primitive/Box';
import Notification from './Notification';

function Animated(n: Notifd.Notification) {
  const notifd = Notifd.get_default();
  const transition = 200;

  let resolved = false;
  let box: Widget.Box;
  let revealer: Widget.Revealer;

  idle(() => (revealer.reveal_child = true));

  function onResolved() {
    if (resolved) return;

    resolved = true;
    revealer.reveal_child = false;
    timeout(transition, () => {
      box.destroy();
    });
  }

  return (
    <box
      halign={END}
      setup={self => {
        box = self;
        self.hook(n, 'resolved', onResolved);
        self.hook(n, 'dismissed', () => {
          if (options.dissmissOnHover.get()) onResolved();
        });
        self.hook(notifd, 'notified', (_, id, replaced) => {
          void (replaced && id == n.id && self.destroy());
        });
      }}
    >
      <revealer transitionDuration={transition} transitionType={SLIDE_DOWN} setup={self => (revealer = self)}>
        <PopupBin p="lg" r="md" css={options.width(w => `min-width: ${w}rem`)}>
          <Box m="md">
            <Notification onHoverLost={onResolved} notification={n} />
          </Box>
        </PopupBin>
      </revealer>
    </box>
  );
}

export default function Notifications(monitor: Gdk.Monitor) {
  const notifd = Notifd.get_default();
  const blacklist = options.blacklist.get;

  const anchor = options.anchor(anchors => anchors.map(a => Astal.WindowAnchor[a.toUpperCase()]).reduce((prev, a) => prev | a, 0));

  function setup(self: Widget.Box) {
    self.hook(notifd, 'notified', (_, id: number) => {
      const n = notifd.get_notification(id);
      if (blacklist().includes(n.appName)) return;

      self.set_children([Animated(n), ...self.get_children()]);
    });
  }

  return (
    <window
      className="Notifications"
      name={`notifications-${monitor.model}`}
      namespace="notifications"
      application={App}
      anchor={anchor}
      gdkmonitor={monitor}
      css="background-color: transparent"
    >
      <box vertical setup={setup} />
    </window>
  );
}
