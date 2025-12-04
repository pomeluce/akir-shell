import Battery from 'gi://AstalBattery?version=0.1';
import { Box, Button, Icon } from '@/components';
import { lengthStr } from '@/support/utils';
import { createBinding, createComputed } from 'gnim';
import { createPoll } from 'ags/time';
import options from 'options';

const { image, size } = options.quicksettings.avatar;

const battery = Battery.get_default();

const SysButton = ({ value, icon }: { value: PowerMenuType; icon: string }) => (
  <Button r="2xl" suggested onClicked={() => powermenu(value)}>
    <Box p="2xl">
      <Icon size={1.4} symbolic iconName={icon} />
    </Box>
  </Button>
);

export default () => {
  const uptime = createPoll(0, 60_000, 'cat /proc/uptime', line => Number.parseInt(line.split('.')[0]) / 60);

  return (
    <Box class="header" gap="xl" m="2xl" pt="2xl">
      <box
        canFocus
        class="avatar"
        css={createComputed([image(), size()], (img, s) => `min-width: ${s}px; min-height: ${s}px; background-image: url('file://${img}'); background-size: cover;`)}
      />
      <Box vertical valign={CENTER} gap="md">
        <Box gap="md" valign={CENTER} visible={createBinding(battery, 'isPresent')}>
          <Icon symbolic iconName={createBinding(battery, 'iconName')} />
          <label label={createBinding(battery, 'percentage').as(p => `${Math.floor(p * 100)}%`)} />
        </Box>
        <Box gap="md" valign={CENTER}>
          <Icon symbolic iconName="hourglass" />
          <label label={uptime(lengthStr)} />
        </Box>
      </Box>
      <box hexpand />
      <SysButton value="lockscreen" icon="system-lock-screen" />
      <SysButton value="logout" icon="system-log-out" />
      <SysButton value="shutdown" icon="system-shutdown" />
    </Box>
  );
};
