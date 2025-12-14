import AstalNotifd from 'gi://AstalNotifd?version=0.1';
import Notification from './notice';
import { Astal, Gdk, Gtk } from 'ags/gtk4';
import { Box, PopupBin } from '@/components';
import { createRoot, createState, For } from 'gnim';
import { idle } from 'ags/time';
import { configs } from 'options';
import app from 'ags/gtk4/app';

const { anchor, blacklist, dissmissOnHover, width } = configs.notifications;

const [list, setList] = createState<AstalNotifd.Notification[]>([]);

function Animated(n: AstalNotifd.Notification) {
  const notifd = AstalNotifd.get_default();
  const transition = 200;

  let resolved = false;
  let revealer: Gtk.Revealer;

  idle(() => (revealer.reveal_child = true));

  function onResolved() {
    if (resolved) return;
    resolved = true;
    revealer.reveal_child = false;
    idle(() => {
      setList(list.peek().filter(v => v.id !== n.id));
    });
  }

  return (
    <box
      visible
      halign={END}
      $={() => {
        n.connect('resolved', onResolved);
        n.connect('dismissed', () => {
          if (dissmissOnHover()) onResolved();
        });
        notifd.connect('notified', (_, id, replaced) => {
          void (replaced && id == n.id);
        });
      }}
    >
      <revealer revealChild transitionDuration={transition} transitionType={SLIDE_DOWN} $={self => (revealer = self)}>
        <PopupBin p="lg" r="md" css={width(w => `min-width: ${w}rem;`)}>
          <Box m="md">
            <Notification onHoverLost={onResolved} notification={n} />
          </Box>
        </PopupBin>
      </revealer>
    </box>
  );
}

export default (monitor: Gdk.Monitor) =>
  createRoot(() => {
    const notifd = AstalNotifd.get_default();

    const position = anchor(anchors => anchors.map(a => Astal.WindowAnchor[a.toUpperCase() as 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT']).reduce((prev, a) => prev | a, 0));

    return (
      <window
        visible={list(v => v.length > 0)}
        class="notifications"
        name={`notifications-${monitor.connector}`}
        namespace="akirds-notifications"
        application={app}
        anchor={position}
        gdkmonitor={monitor}
        css="background-color: transparent;"
      >
        <box
          orientation={Gtk.Orientation.VERTICAL}
          $={() => {
            notifd.connect('notified', (_, id) => {
              const n = notifd.get_notification(id);
              if (blacklist().includes(n?.appName ?? '')) return;
              setList([n!, ...list.peek()]);
            });
          }}
        >
          <For each={list}>{Animated}</For>
        </box>
      </window>
    );
  });
