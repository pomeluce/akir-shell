import Network from 'gi://AstalNetwork';
import Box from 'gtk/primitive/Box';
import FlatButton from 'gtk/primitive/FlatButton';
import Separator from 'gtk/primitive/Separator';
import Icon from 'gtk/primitive/Icon';
import { bind, Variable } from 'astal';
import NM from 'gi://NM';
import { scss } from 'core/theme';

const noPw = NM['80211ApSecurityFlags'].NONE;

function AccessPoint({ ap }: { ap: Network.AccessPoint }) {
  const nw = Network.get_default();
  const selected = bind(nw.wifi, 'activeAccessPoint').as(aap => aap == ap);

  const color = bind(ap, 'strength').as(s => {
    if (s > 75) return 'success';
    if (s > 50) return 'primary';
    return 'error';
  });

  const bitrate = bind(ap, 'maxBitrate').as(br => `${br / 1000} Mbit/s`);
  const hasPW = bind(ap, 'wpaFlags').as(flags => flags !== noPw);
  const lock = Variable.derive([hasPW, selected], (pw, s) => pw && !s);

  function connect() {
    print('todo', ap.ssid);
  }

  return (
    <FlatButton color={color} onClicked={connect}>
      <Box px="2xl" m="md">
        <Icon symbolic css="margin-right:.2em" icon={bind(ap, 'iconName')} />
        <Icon symbolic visible={lock()} icon="system-lock-screen" css="margin-right:.2em;color:white" />
        <Icon symbolic visible={selected} icon="object-select" css={selected.as(s => `opacity: ${s ? 100 : 0}`)} />
        <label css="margin-left:.2em" label={bind(ap, 'ssid').as(String)} wrap />
        <label hexpand halign={END} className="flat" label={bitrate} />
      </Box>
    </FlatButton>
  );
}

void scss`.Launcher .Network {
    /* md Separator spacing */
    margin-top: -$spacing * .4;
}`;

export default function Wifi(filter: Variable<Array<string>>) {
  const nw = Network.get_default();
  const aps = Variable.derive([bind(nw.wifi, 'accessPoints'), bind(nw.wifi, 'strength')], aps => aps.sort((a, b) => b.strength - a.strength));

  return (
    <revealer revealChild={aps(aps => aps.length > 0)} transitionType={SLIDE_DOWN}>
      <Box vertical pb="xl" className="Network">
        {aps(aps =>
          aps.map(ap => (
            <Box vertical visible={filter(f => f.includes(ap.ssid))}>
              <Separator my="md" />
              <AccessPoint ap={ap} />
            </Box>
          )),
        )}
      </Box>
    </revealer>
  );
}
