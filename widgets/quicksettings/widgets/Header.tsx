import Battery from 'gi://AstalBattery?version=0.1';
import Button from 'gtk/primitive/Button';
import Box from 'gtk/primitive/Box';
import Icon from 'gtk/primitive/Icon';
import { bind, Variable } from 'astal';
import { lengthStr } from 'core/lib/utils';
import { Btn } from '../../powermenu';
import options from 'options';

const { image, size } = options.quicksettings.avatar;

const battery = Battery.get_default();

const SysButton = ({ value, icon }: { value: Btn; icon: string }) => (
  <Button r="2xl" suggested onClicked={() => powermenu(value)}>
    <Box p="2xl">
      <Icon size={1.4} symbolic icon={icon} />
    </Box>
  </Button>
);

export default function Header() {
  const uptime = Variable(0).poll(60_000, 'cat /proc/uptime', line => Number.parseInt(line.split('.')[0]) / 60);
  return (
    <Box className="Header" gap="xl" m="2xl" pt="2xl">
      <box
        canFocus
        className="Avatar"
        css={Variable.derive(
          [image, size],
          (img, s) => `
          min-width: ${s}px;
          min-height: ${s}px;
          background-image: url('${img}');
          background-size: cover;
        `,
        )()}
      />
      <Box vertical valign={CENTER} gap="md">
        <Box gap="md" valign={CENTER} visible={bind(battery, 'isPresent')}>
          <Icon symbolic icon={bind(battery, 'iconName')} />
          <label label={bind(battery, 'percentage').as(p => `${Math.floor(p * 100)}%`)} />
        </Box>
        <Box gap="md" valign={CENTER}>
          <Icon symbolic icon="hourglass" />
          <label label={uptime(lengthStr)} />
        </Box>
      </Box>
      <box hexpand />
      <box hexpand />
      <box hexpand />
      <SysButton value="lockscreen" icon="system-lock-screen" />
      <SysButton value="logout" icon="system-log-out" />
      <SysButton value="shutdown" icon="system-shutdown" />
    </Box>
  );
}
