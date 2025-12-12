import PanelButton from './panel-button';
import Icon from '@/components/icon';
import { Box } from '@/components';
import { sh } from '@/support/os';
import { configs } from 'options';

export default function Launcher() {
  const { icon, label, action, flat, suggested } = configs.bar.launcher;

  return (
    <PanelButton winName="launcher" suggested={suggested()} flat={flat()} color="primary" class="launcher" tooltipText={label()} onClicked={() => sh(action.peek())}>
      <Box gap="md">
        <Icon visible={icon(Boolean)} iconName={icon()} />
      </Box>
    </PanelButton>
  );
}
