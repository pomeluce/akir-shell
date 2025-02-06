import Box from 'gtk/primitive/Box';
import PanelButton from '../PanelButton';
import options from '../options';
import { sh } from 'core/lib/os';

export default function Launcher() {
  const { icon, label, action, flat, suggested } = options.launcher;

  return (
    <PanelButton winName="launcher" suggested={suggested()} flat={flat()} color="primary" className="Launcher" tooltipText={label()} onClicked={() => sh(action.get())}>
      <Box gap="md">
        <icon visible={icon(Boolean)} icon={icon()} />
      </Box>
    </PanelButton>
  );
}
