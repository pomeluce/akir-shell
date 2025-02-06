import { App } from 'astal/gtk3';
import type Apps from 'gi://AstalApps';
import Box from 'gtk/primitive/Box';
import Button from 'gtk/primitive/Button';
import Icon from 'gtk/primitive/Icon';

export default function AppButton({ app }: { app: Apps.Application }) {
  return (
    <Button
      flat
      r="2xl"
      m="2xl"
      tooltipText={app.description}
      onClicked={() => {
        app.launch();
        App.get_window('drawer')!.visible = false;
      }}
    >
      <Box vertical p="lg">
        <Box mx="2xl">
          <Icon icon={app.iconName} size={5} />
        </Box>
        <label truncate label={app.name} />
      </Box>
    </Button>
  );
}
