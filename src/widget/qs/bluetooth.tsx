import BT from 'gi://AstalBluetooth?version=0.1';
import { QSMenu, QSToggleButton } from './button';
import { Box, FlatButton, Icon, Separator, Spinner } from '@/components';
import { For, createBinding } from 'gnim';
import { sh } from '@/support/os';
import { timeout } from 'ags/time';
import options from 'options';

const bluetooth = BT.get_default();
const bt = createBinding(bluetooth, 'adapter').get();
const { quicksettings } = options;

export const Bluetooth = () => {
  const icon = createBinding(bt, 'powered').as(p => (p ? 'bluetooth-active' : 'bluetooth-disabled'));

  const device = createBinding(bluetooth, 'devices').as(ds => ds.filter(d => d.connected));

  return (
    <QSToggleButton
      name="bluetooth"
      icon={icon}
      state={createBinding(bt, 'powered')}
      label={createBinding(bt, 'powered').as(p => (p ? (device.get().length === 1 ? device.get()[0].alias : `${device.get().length} Connected`) : 'Disabled'))}
      activate={() => {
        bt.powered = true;
        bt.start_discovery();
        timeout(10000, () => {
          bt.stop_discovery();
        });
      }}
      deactivate={() => (bt.powered = false)}
    />
  );
};

export const BluetoothDevices = () => {
  const icon = createBinding(bt, 'powered').as(p => (p ? 'bluetooth-active' : 'bluetooth-disabled'));

  return (
    <QSMenu name="bluetooth" icon={icon} title="Bluetooth Devices">
      <Box vertical pb="xl">
        <For each={createBinding(bluetooth, 'devices').as(ds => ds.filter(d => !!d.name))}>
          {(device: BT.Device) => {
            const connected = createBinding(device, 'connected');
            const connecting = createBinding(device, 'connecting');

            function onClicked() {
              bluetooth.adapter.powered = true;
              if (!device.connecting && !device.connected) device.connect_device(null);
              else device.disconnect_device(null);
            }

            return (
              <FlatButton onClicked={onClicked} color={connected.as(c => (c ? 'success' : 'primary'))}>
                <Box px="2xl" m="lg">
                  <Icon symbolic iconName={createBinding(device, 'icon').as(i => i || 'bluetooth')} />
                  <label label={createBinding(device, 'alias')} css="margin-left: .3em;" />
                  <box hexpand />
                  <revealer transitionType={SLIDE_LEFT} revealChild={connected}>
                    <label class="flat" label="connected" />
                  </revealer>
                  <revealer transitionType={SLIDE_LEFT} revealChild={connecting}>
                    <Spinner />
                  </revealer>
                </Box>
              </FlatButton>
            );
          }}
        </For>
      </Box>
      <Separator my="md" />
      <button onClicked={() => sh(quicksettings.bluetooth.get())}>
        <Box px="2xl" gap="md">
          <Icon symbolic iconName="applications-system" />
          <label label="Bluetooth" />
        </Box>
      </button>
    </QSMenu>
  );
};
