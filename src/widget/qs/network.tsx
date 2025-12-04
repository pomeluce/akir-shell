import NW from 'gi://AstalNetwork?version=0.1';
import NM from 'gi://NM?version=1.0';
import { Box, FlatButton, Icon, Separator } from '@/components';
import { QSMenu, QSToggleButton } from './button';
import { createBinding, createComputed, For } from 'gnim';
import { dependencies, sh } from '@/support/os';
import { execAsync } from 'ags/process';
import options from 'options';

// @ts-ignore
const noPw = NM['80211ApSecurityFlags'].NONE;

const nw = NW.get_default();
const wifi = createBinding(nw, 'wifi').get();

const { quicksettings } = options;

export function Network() {
  return (
    <QSToggleButton
      name="network"
      icon={createBinding(wifi, 'iconName')}
      state={createBinding(wifi, 'enabled')}
      label={createBinding(wifi, 'enabled').as(v =>
        v
          ? createBinding(wifi, 'ssid')
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
  const aps = createComputed([createBinding(nw.wifi, 'accessPoints'), createBinding(nw.wifi, 'strength')], aps => aps.sort((a, b) => b.strength - a.strength).slice(0, 10));

  return (
    <QSMenu name="network" icon={createBinding(wifi, 'iconName')} title="Wifi Selection">
      <Box vertical>
        <For each={aps}>
          {(ap: NW.AccessPoint) => {
            const color = createBinding(ap, 'strength').as(s => {
              if (s > 75) return 'success';
              if (s > 50) return 'primary';
              return 'error';
            });

            const nw = NW.get_default();
            const selected = createBinding(nw.wifi, 'activeAccessPoint').as(aap => aap == ap);

            const bitrate = createBinding(ap, 'maxBitrate').as(br => `${br / 1000} Mbit/s`);
            const hasPW = createBinding(ap, 'wpaFlags').as(flags => flags !== noPw);

            const lock = createComputed([hasPW, selected], (pw, s) => pw && !s);

            return (
              <FlatButton
                color={color}
                onClicked={() => {
                  if (dependencies('nmcli')) execAsync(['nmcli', 'device', 'wifi', 'connect', ap.ssid]);
                }}
              >
                <Box px="2xl" m="md">
                  <Icon symbolic css="margin-right:.2em;" iconName={createBinding(ap, 'iconName')} />
                  <Icon symbolic visible={lock} iconName="system-lock-screen" css="margin-right:.3em;color:white;" />
                  <Icon symbolic visible={selected} iconName="object-select" css={selected.as(s => `opacity: ${s ? 100 : 0};`)} />
                  <label css="margin-left:.2em;" label={createBinding(ap, 'ssid').as(v => v || '--')} wrap />
                  <label hexpand halign={END} class="flat" label={bitrate} />
                </Box>
              </FlatButton>
            );
          }}
        </For>
      </Box>
      <Separator my="md" />
      <button onClicked={() => sh(quicksettings.network.get())}>
        <Box px="2xl" gap="md">
          <Icon symbolic iconName="applications-system" />
          <label label="Network" />
        </Box>
      </button>
    </QSMenu>
  );
}
