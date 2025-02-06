import { bind, timeout } from 'astal';
import Bluetooth from 'gi://AstalBluetooth';
import ToggleButton from 'gtk/primitive/ToggleButton';
import Box from 'gtk/primitive/Box';
import Spinner from 'gtk/primitive/Spinner';
import Icon from 'gtk/primitive/Icon';

function BtIcon({ bt }: { bt: Bluetooth.Adapter }) {
  const icon = bind(bt, 'powered').as(p => (p ? 'bluetooth-active' : 'bluetooth-disabled'));

  const discover = () => {
    if (bt.powered) {
      bt.start_discovery();
      timeout(10000, () => {
        bt.stop_discovery();
      });
    }
  };

  return (
    <box setup={discover}>
      <revealer transitionType={SLIDE_LEFT} revealChild={bind(bt, 'discovering')}>
        <Box mr="sm">
          <Spinner className="primary" />
        </Box>
      </revealer>
      <ToggleButton
        vfill
        suggested
        color="primary"
        state={bind(bt, 'powered')}
        onToggled={() => {
          bt.powered = !bt.powered;
          discover();
        }}
      >
        <Box px="xl">
          <Icon symbolic icon={icon} />
        </Box>
      </ToggleButton>
    </box>
  );
}

export default function BluetoothIcon() {
  const bt = Bluetooth.get_default();

  return <box>{bind(bt, 'adapter').as(bt => bt && <BtIcon bt={bt} />)}</box>;
}
