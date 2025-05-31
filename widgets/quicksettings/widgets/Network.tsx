import NW from 'gi://AstalNetwork';
import NM from 'gi://NM';
import { bind, execAsync, Variable } from 'astal';
import { QSMenu, QSToggleButton } from '../QSButton';
import Box from 'gtk/primitive/Box';
import Separator from 'gtk/primitive/Separator';
import FlatButton from 'gtk/primitive/FlatButton';
import Icon from 'gtk/primitive/Icon';
import { dependencies, sh } from 'core/lib/os';
import options from 'options';

const noPw = NM['80211ApSecurityFlags'].NONE;

const nw = NW.get_default();
const wifi = bind(nw, 'wifi').get();

const { quicksettings } = options;

export function Network() {
  return (
    <QSToggleButton
      name="network"
      icon={bind(wifi, 'iconName')}
      state={bind(wifi, 'enabled')}
      label={bind(wifi, 'enabled').as(v =>
        v
          ? bind(wifi, 'ssid')
              .as(ssid => ssid || 'Not Connected')
              .get()
          : 'Wi-Fi',
      )}
      activate={() => {
        wifi.enabled = true;
        wifi.scan();
      }}
      deactivate={() => (wifi.enabled = false)}
    />
  );
}

export function WifiSelection() {
  const aps = Variable.derive([bind(nw.wifi, 'accessPoints'), bind(nw.wifi, 'strength')], aps => aps.sort((a, b) => b.strength - a.strength).slice(0, 10));

  return (
    <QSMenu name="network" icon={bind(wifi, 'iconName')} title="Wifi Selection">
      <Box vertical>
        {aps(aps =>
          aps.map(ap => {
            const color = bind(ap, 'strength').as(s => {
              if (s > 75) return 'success';
              if (s > 50) return 'primary';
              return 'error';
            });

            const nw = NW.get_default();
            const selected = bind(nw.wifi, 'activeAccessPoint').as(aap => aap == ap);

            const bitrate = bind(ap, 'maxBitrate').as(br => `${br / 1000} Mbit/s`);
            const hasPW = bind(ap, 'wpaFlags').as(flags => flags !== noPw);

            const lock = Variable.derive([hasPW, selected], (pw, s) => pw && !s);
            return (
              <FlatButton
                color={color}
                onClicked={() => {
                  if (dependencies('nmcli')) execAsync(['nmcli', 'device', 'wifi', 'connect', ap.ssid]);
                }}
              >
                <Box px="2xl" m="md">
                  <Icon symbolic css="margin-right:.2em" icon={bind(ap, 'iconName')} />
                  <Icon symbolic visible={lock()} icon="system-lock-screen" css="margin-right:.3em;color:white" />
                  <Icon symbolic visible={selected} icon="object-select" css={selected.as(s => `opacity: ${s ? 100 : 0}`)} />
                  <label css="margin-left:.2em" label={bind(ap, 'ssid').as(v => v || '--')} wrap />
                  <label hexpand halign={END} className="flat" label={bitrate} />
                </Box>
              </FlatButton>
            );
          }),
        )}
      </Box>
      <Separator my="md" />
      <button onClicked={() => sh(quicksettings.network.get())}>
        <Box px="2xl" gap="md">
          <Icon symbolic icon="applications-system" />
          <label label="Network" />
        </Box>
      </button>
    </QSMenu>
  );
}
