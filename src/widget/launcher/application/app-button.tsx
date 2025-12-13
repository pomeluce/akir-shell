import AstalApps from 'gi://AstalApps?version=0.1';
import Pango from 'gi://Pango?version=1.0';
import App from 'ags/gtk4/app';
import { Box, Button, Icon } from '@/components';
import { Gtk } from 'ags/gtk4';
import { scss } from '@/theme/style';
import { configs } from 'options';

void scss`.launcher .app-button {
  label.name {
    font-weight: bold;
  }

  label.description {
    font-weight: normal;
    color: transparentize($fg, .2);
    font-size: .75em;
  }
}`;

export function AppButton({ app }: { app: AstalApps.Application }) {
  const { icon } = configs.launcher.app;

  return (
    <Button
      hfill
      flat
      hexpand
      class="app-button"
      onClicked={() => {
        app.launch();
        App.get_window('launcher')!.hide();
      }}
    >
      <box>
        <Box p="xl">
          <Icon symbolic={icon.monochrome()} pixelSize={icon.size() * 10} iconSize={Gtk.IconSize.LARGE} iconName={app.iconName} fallback="application-x-executable" />
        </Box>
        <Box pr="lg" vertical valign={CENTER}>
          <label class="name" halign={START} label={app.name} singleLineMode ellipsize={Pango.EllipsizeMode.END} />
          {app.description && <label xalign={0} class="description" wrap label={app.description} maxWidthChars={64} />}
        </Box>
      </box>
    </Button>
  );
}
