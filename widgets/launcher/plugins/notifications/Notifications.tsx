import { Variable, bind } from 'astal';
import Notifd from 'gi://AstalNotifd';
import Separator from 'gtk/primitive/Separator';
import Box from 'gtk/primitive/Box';
import Notification from './Notification';
import Icon from 'gtk/primitive/Icon';
import options from '../../options';
import { scss } from 'core/theme';

void scss`.Launcher .Notifications {
    .List {
        /* md Separator spacing */
        margin-top: -$spacing * .4;
    }
}`;

export default function Notifs(filter: Variable<Array<string>>) {
  const notifd = Notifd.get_default();

  // TODO: use VarMap
  const notifs = Variable.derive([bind(notifd, 'notifications'), options.notifications.maxItems], (ns, max) => ns.slice(0, max).sort((a, b) => a.time - b.time));

  return (
    <Box vertical className="Notifications" pb="2xl">
      <Box vertical className="List">
        {notifs(ns =>
          ns.map(n => (
            <revealer revealChild={filter(f => f.length === 0 || f.includes(n.appName.toLowerCase()))} transitionType={SLIDE_DOWN}>
              <box vertical>
                <Separator my="md" />
                <Box px="2xl">
                  <Notification notification={n} />
                </Box>
              </box>
            </revealer>
          )),
        )}
      </Box>
      <box vertical visible={bind(notifd, 'notifications').as(ns => ns.length == 0)}>
        <Separator />
        <Box pt="2xl" halign={CENTER}>
          <Icon symbolic icon="notifications-disabled-symbolic" css="margin-right: .1em" className="error" />
          There are no messages yet
        </Box>
      </box>
    </Box>
  );
}
