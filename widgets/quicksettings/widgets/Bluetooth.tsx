import BT from 'gi://AstalBluetooth';
import { QSMenu, QSToggleButton } from '../QSButton';
import { bind, timeout } from 'astal';
import Box from 'gtk/primitive/Box';
import FlatButton from 'gtk/primitive/FlatButton';
import Icon from 'gtk/primitive/Icon';
import Spinner from 'gtk/primitive/Spinner';
import Separator from 'gtk/primitive/Separator';
import { sh } from 'core/lib/os';
import options from 'options';

const bluetooth = BT.get_default();
const bt = bind(bluetooth, 'adapter').get();
const { quicksettings } = options;

export const Bluetooth = () => {
  const icon = bind(bt, 'powered').as(p => (p ? 'bluetooth-active' : 'bluetooth-disabled'));

  const device = bind(bluetooth, 'devices').as(ds => ds.filter(d => d.connected));

  return (
    <QSToggleButton
      name="bluetooth"
      icon={icon}
      state={bind(bt, 'powered')}
      label={bind(bt, 'powered').as(p => (p ? (device.get().length === 1 ? device.get()[0].alias : `${device.get().length} Connected`) : 'Disabled'))}
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
  const icon = bind(bt, 'powered').as(p => (p ? 'bluetooth-active' : 'bluetooth-disabled'));

  return (
    <QSMenu name="bluetooth" icon={icon} title="Bluetooth Devices">
      <Box vertical pb="xl">
        {bind(bluetooth, 'devices').as(ds =>
          ds
            .filter(d => !!d.name)
            .map(device => {
              const connected = bind(device, 'connected');
              const connecting = bind(device, 'connecting');

              function onClicked() {
                bluetooth.adapter.powered = true;
                if (!device.connecting && !device.connected) device.connect_device(null);
                else device.disconnect_device(null);
              }

              return (
                <FlatButton onClicked={onClicked} color={connected.as(c => (c ? 'success' : 'primary'))}>
                  <Box px="2xl" m="lg">
                    <Icon symbolic icon={bind(device, 'icon').as(i => i || 'bluetooth')} />
                    <label label={bind(device, 'alias')} css="margin-left: .3em" />
                    <box hexpand />
                    <revealer transitionType={SLIDE_LEFT} revealChild={connected}>
                      <label className="flat" label="connected" />
                    </revealer>
                    <revealer transitionType={SLIDE_LEFT} revealChild={connecting}>
                      <Spinner />
                    </revealer>
                  </Box>
                </FlatButton>
              );
            }),
        )}
      </Box>
      <Separator my="md" />
      <button onClicked={() => sh(quicksettings.bluetooth.get())}>
        <Box px="2xl" gap="md">
          <Icon symbolic icon="applications-system" />
          <label label="Bluetooth" />
        </Box>
      </button>
    </QSMenu>
  );
};
