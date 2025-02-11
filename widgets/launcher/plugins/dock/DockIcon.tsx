import { App } from 'astal/gtk3';
import { sh } from 'core/lib/os';
import Box from 'gtk/primitive/Box';
import Button from 'gtk/primitive/Button';
import Icon from 'gtk/primitive/Icon';
import options from 'options';

export default function DockIcon() {
  const { action } = options.launcher.dock;

  function click() {
    sh(action.get());
    App.get_window('launcher')!.visible = false;
  }

  return (
    <Button vfill flat suggested color="primary" onClicked={click}>
      <Box px="xl">
        <Icon symbolic icon="view-grid" />
      </Box>
    </Button>
  );
}
