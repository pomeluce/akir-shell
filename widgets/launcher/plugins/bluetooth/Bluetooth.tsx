import { bind, Variable } from 'astal';
import BT from 'gi://AstalBluetooth';
import Icon from 'gtk/primitive/Icon';
import Box from 'gtk/primitive/Box';
import FlatButton from 'gtk/primitive/FlatButton';
import Separator from 'gtk/primitive/Separator';
import Spinner from 'gtk/primitive/Spinner';

function Device({ device }: { device: BT.Device }) {
  const bt = BT.get_default();
  const connected = bind(device, 'connected');
  const connecting = bind(device, 'connecting');

  function onClicked() {
    bt.adapter.powered = true;
    if (!device.connecting && !device.connected) device.connect_device(null);
    else device.disconnect_device(null);
  }

  return (
    <FlatButton onClicked={onClicked} color={connected.as(c => (c ? 'success' : 'primary'))}>
      <Box px="2xl" m="lg">
        <Icon symbolic icon={bind(device, 'icon')} />
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
}

export default function Bluetooth(filter: Variable<Array<string>>) {
  const bt = BT.get_default();

  return (
    <Box vertical pb="xl">
      {bind(bt, 'devices').as(ds =>
        ds
          .filter(d => d.name)
          .map(d => (
            <revealer transitionType={SLIDE_DOWN} revealChild={filter(f => f.includes(d.name.toLowerCase()))}>
              <box vertical>
                <Separator />
                <Device device={d} />
              </box>
            </revealer>
          )),
      )}
    </Box>
  );
}
