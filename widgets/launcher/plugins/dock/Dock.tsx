import { App } from 'astal/gtk3';
import Variable from 'astal/variable';
import Apps from 'gi://AstalApps';
import Separator from 'gtk/primitive/Separator';
import Button from 'gtk/primitive/Button';
import Box from 'gtk/primitive/Box';
import Icon from 'gtk/primitive/Icon';
import { bind } from 'astal';
import options from 'options';

function DockAppButton(app: Apps.Application) {
  const { icon } = options.launcher.dock;

  return (
    <Button
      flat
      hfill
      tooltipText={bind(app, 'name')}
      onClicked={() => {
        app.launch();
        App.get_window('launcher')!.visible = false;
      }}
    >
      <Box p="xl">
        <Icon hexpand symbolic={icon.monochrome()} size={icon.size()} halign={CENTER} icon={bind(app, 'iconName')} fallback="Application-x-executable" />
      </Box>
    </Button>
  );
}

export default function Dock(apps: Variable<Array<Apps.Application>>) {
  return (
    <box vertical hexpand={false} className="Dock">
      <Separator />
      <Box gap="lg" mt="lg" p="2xl" css="padding-top: 0">
        {apps(apps => apps.map(DockAppButton))}
      </Box>
    </box>
  );
}
