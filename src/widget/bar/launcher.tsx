import options from 'options';
import PanelButton from './panel-button';
import Icon from '@/components/icon';
import { Box } from '@/components';
import { sh } from '@/support/os';

export default function Launcher() {
  const { icon, label, action, flat, suggested } = options.bar.launcher;

  return (
    <PanelButton winName="launcher" suggested={suggested()} flat={flat()} color="primary" class="launcher" tooltipText={label()} onClicked={() => sh(action.get())}>
      <Box gap="md">
        <Icon visible={icon()(Boolean)} iconName={icon()} />
      </Box>
    </PanelButton>
  );
}
