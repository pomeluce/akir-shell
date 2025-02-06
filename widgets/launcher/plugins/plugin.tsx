import { Gtk } from 'astal/gtk3';
import { idle } from 'astal/time';
import Variable from 'astal/variable';
import Binding from 'astal/binding';
import Box from 'gtk/primitive/Box';
import options from '../options';
import Dock from '../plugins/dock';
import Default from '../plugins/default';
import Nix from '../plugins/nix';
import Hyprland from '../plugins/hyprland';
import Sh from '../plugins/sh';
import Media from '../plugins/media';
import PowerMenu from '../plugins/powermenu';
import Notifications from '../plugins/notifications';
import Calendar from '../plugins/calendar';
import Wifi from '../plugins/wifi';
import Theme from './theme';
import Audio from './audio';
import Bluetooth from '../plugins/bluetooth';
import { scss } from 'core/theme';
import Icon from 'gtk/primitive/Icon';

void scss`.Launcher icon {
    &.regular { color: $fg; }
    &.primary { color: $primary; }
    &.success { color: $success; }
    &.error { color: $error; }
}`;

export default function plugins() {
  const o = options;

  return Variable.derive(
    [
      o.hyprland.enable,
      o.hyprland.prefix,
      o.nix.enable,
      o.nix.prefix,
      o.sh.enable,
      o.sh.prefix,
      o.music.enable,
      o.music.prefix,
      o.powermenu.enable,
      o.powermenu.prefix,
      o.notifications.enable,
      o.notifications.prefix,
      o.calendar.enable,
      o.calendar.prefix,
      o.wifi.enable,
      o.wifi.prefix,
      o.audio.enable,
      o.audio.prefix,
      o.theme.enable,
      o.theme.prefix,
      o.bluetooth.enable,
      o.bluetooth.prefix,
      o.dock.enable,
    ],
    () => ({
      [o.nix.prefix.get()]: o.nix.enable.get() ? mkPlugin(Nix) : null,
      [o.sh.prefix.get()]: o.sh.enable.get() ? mkPlugin(Sh) : null,
      [o.audio.prefix.get()]: o.audio.enable.get() ? mkPlugin(Audio) : null,
      [o.wifi.prefix.get()]: o.wifi.enable.get() ? mkPlugin(Wifi) : null,
      [o.bluetooth.prefix.get()]: o.bluetooth.enable.get() ? mkPlugin(Bluetooth) : null,
      [o.hyprland.prefix.get()]: o.hyprland.enable.get() ? mkPlugin(Hyprland) : null,
      [o.music.prefix.get()]: o.music.enable.get() ? mkPlugin(Media) : null,
      [o.powermenu.prefix.get()]: o.powermenu.enable.get() ? mkPlugin(PowerMenu) : null,
      [o.notifications.prefix.get()]: o.notifications.enable.get() ? mkPlugin(Notifications) : null,
      [o.calendar.prefix.get()]: o.calendar.enable.get() ? mkPlugin(Calendar) : null,
      [o.theme.prefix.get()]: o.theme.enable.get() ? mkPlugin(Theme) : null,

      dock: o.dock.enable.get() ? mkPlugin(Dock) : null,
      default: mkPlugin(Default),
    }),
  );
}

function mkPlugin(pluginCtor: () => Plugin) {
  const { icon, ui, ...plugin } = pluginCtor();

  const visible = Variable(false);

  idle(plugin.reload);

  return {
    ...plugin,

    complete: plugin.complete ?? (() => ''),

    visible(v: boolean) {
      visible.set(v);
    },

    icon: icon && (
      <revealer revealChild={visible()} transitionType={SLIDE_LEFT}>
        {icon instanceof Gtk.Widget ? (
          icon
        ) : (
          <Box pr="xl">
            <Icon symbolic className={typeof icon === 'object' ? (icon.color ?? 'primary') : 'primary'} icon={typeof icon === 'object' ? icon.icon : icon} />
          </Box>
        )}
      </revealer>
    ),

    ui: (
      <revealer revealChild={visible()} transitionType={SLIDE_DOWN}>
        {ui}
      </revealer>
    ),
  };
}

export type Plugin = {
  ui?: Gtk.Widget;
  icon?: string | Gtk.Widget | { icon: string; color?: 'primary' | 'regular' | 'error' | 'success' };
  description?: string | Binding<string>;
  reload?(): void;
  search(search: string): void;
  enter(entered: string): void;
  complete?(search: string): string;
};
