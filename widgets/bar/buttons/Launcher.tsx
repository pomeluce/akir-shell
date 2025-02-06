import Box from 'gtk/primitive/Box';
import PanelButton from '../PanelButton';
import { sh } from 'core/lib/os';
import options from 'options';

export default function Launcher() {
  const { icon, label, action, flat, suggested } = options.bar.launcher;

  return (
    <PanelButton winName="launcher" suggested={suggested()} flat={flat()} color="primary" className="Launcher" tooltipText={label()} onClicked={() => sh(action.get())}>
      <Box gap="md">
        <icon visible={icon(Boolean)} icon={icon()} />
      </Box>
    </PanelButton>
  );
}
