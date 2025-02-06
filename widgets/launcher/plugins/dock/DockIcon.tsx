import options from '../../options';
import { App } from 'astal/gtk3';
import { sh } from 'core/lib/os';
import Box from 'gtk/primitive/Box';
import Button from 'gtk/primitive/Button';
import Icon from 'gtk/primitive/Icon';

export default function DockIcon() {
  const { action } = options.dock;

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
