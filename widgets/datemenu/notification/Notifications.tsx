import { Variable, bind } from 'astal';
import Notifd from 'gi://AstalNotifd';
import Box from 'gtk/primitive/Box';
import { scss } from 'core/theme';
import options from 'options';
import Button from 'gtk/primitive/Button';
import { sleep } from 'core/lib/function';
import Icon from 'gtk/primitive/Icon';
import { Gtk } from 'astal/gtk3';

void scss`.DateMenu .Notifications {
  .notification-scrollable {
    all: unset;
  }
  .List {
    /* md Separator spacing */
    margin-top: -$spacing * .4;
  }
}`;

function ClearButton() {
  const notifd = Notifd.get_default();
  const notifs = bind(notifd, 'notifications').as(ns => ns.length);
  const icon = notifs.as(l => (l > 0 ? 'user-trash-full' : 'user-trash'));

  async function clear() {
    while (notifd.get_notifications().length > 0) {
      notifd.get_notifications()[0]?.dismiss();
      await sleep(100);
    }
  }

  return (
    <revealer revealChild={notifs.as(l => l > 0)} transitionType={SLIDE_LEFT}>
      <Button mx="md" vfill hfill sensitive={notifs.as(l => l > 0)} tooltipText="Clear" flat suggested color="success" onClicked={clear}>
        <Box px="xl">
          <label label="Clear" />
          <Icon symbolic icon={icon} css="margin-right:.2em" />
        </Box>
      </Button>
    </revealer>
  );
}

export default function Notifications() {
  const notifd = Notifd.get_default();

  // TODO: use VarMap
  const notifs = Variable.derive([bind(notifd, 'notifications'), options.notifications.maxItems], (ns, max) => ns.slice(0, max).sort((a, b) => a.time - b.time));

  return (
    <Box vertical className="Notifications" css={options.notifications.width(w => `min-width: ${w}px`)}>
      <box className="header">
        <label label="Notifications" hexpand xalign={0} />
        <ClearButton />
      </box>
      <scrollable className="notification-scrollable" hscroll={Gtk.PolicyType.NEVER}>
        <Box className="raised" vertical vexpand hexpand valign={CENTER} halign={CENTER} visible={notifs().as(n => n.length === 0)} gap="md">
          <Icon symbolic icon="notifications-disabled" size={options.notifications.iconSize()} />
          <label label={options.notifications.text()} />
        </Box>
      </scrollable>
    </Box>
  );

  // return (
  //   <Box vertical className="Notifications" pb="2xl">
  //     <Box vertical className="List">
  //       {notifs(ns =>
  //         ns.map(n => (
  //           <revealer>
  //             <box vertical>
  //               <Separator my="md" />
  //               <Box px="2xl">
  //                 <Notification notification={n} />
  //               </Box>
  //             </box>
  //           </revealer>
  //         )),
  //       )}
  //     </Box>
  //     <box vertical visible={bind(notifd, 'notifications').as(ns => ns.length == 0)}>
  //       <Separator />
  //       <Box pt="2xl" halign={CENTER}>
  //         <Icon symbolic icon="notifications-disabled-symbolic" css="margin-right: .1em" className="error" />
  //         There are no messages yet
  //       </Box>
  //     </box>
  //   </Box>
  // );
}
