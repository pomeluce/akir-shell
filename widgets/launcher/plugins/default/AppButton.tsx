import type Apps from 'gi://AstalApps';
import { App } from 'astal/gtk3';
import Button from 'gtk/primitive/Button';
import Box from 'gtk/primitive/Box';
import Icon from 'gtk/primitive/Icon';
import options from '../../options';
import { scss } from 'core/theme';

void scss`.Launcher .AppButton {
  label.name {
    font-weight: bold;
  }

  label.description {
    font-weight: normal;
    color: transparentize($fg, .2);
    font-size: .8em;
  }
}`;

export default function AppButton({ app }: { app: Apps.Application }) {
  const { icon } = options.default;

  return (
    <Button
      hfill
      flat
      hexpand
      className="AppButton"
      onClicked={() => {
        app.launch();
        App.get_window('launcher')!.hide();
      }}
    >
      <box>
        <Box p="xl">
          <Icon symbolic={icon.monochrome()} size={icon.size()} icon={app.iconName} fallback="application-x-executable" />
        </Box>
        <Box pr="lg" vertical valign={CENTER}>
          <label className="name" halign={START} label={app.name} truncate />
          {app.description && <label xalign={0} className="description" wrap label={app.description} />}
        </Box>
      </box>
    </Button>
  );
}
