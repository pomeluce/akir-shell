import Network from 'gi://AstalNetwork';
import { bind } from 'astal';
import Box from 'gtk/primitive/Box';
import Button from 'gtk/primitive/Button';
import options from '../../options';
import { sh } from 'core/lib/os';

export default function WifiIcon() {
  const { wifi } = Network.get_default();
  const { settings } = options.wifi;

  const color = bind(wifi, 'strength').as(s => {
    if (s > 75) return 'success';
    if (s > 50) return 'primary';
    return 'error';
  });

  return (
    <Button vfill flat suggested color={color} tooltipText={bind(wifi, 'ssid')} onClicked={() => sh(settings.get())}>
      <Box px="xl">
        <icon icon={bind(wifi, 'iconName')} />
      </Box>
    </Button>
  );
}
