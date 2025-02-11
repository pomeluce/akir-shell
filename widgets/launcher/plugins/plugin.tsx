import { Gtk } from 'astal/gtk3';
import { idle } from 'astal/time';
import Variable from 'astal/variable';
import Binding from 'astal/binding';
import Box from 'gtk/primitive/Box';
import Dock from '../plugins/dock';
import Default from '../plugins/default';
import Sh from '../plugins/sh';
import { scss } from 'core/theme';
import Icon from 'gtk/primitive/Icon';
import options from 'options';

void scss`.Launcher icon {
    &.regular { color: $fg; }
    &.primary { color: $primary; }
    &.success { color: $success; }
    &.error { color: $error; }
}`;

export default function plugins() {
  const o = options.launcher;

  return Variable.derive([o.sh.enable, o.sh.prefix, o.dock.enable], () => ({
    [o.sh.prefix.get()]: o.sh.enable.get() ? mkPlugin(Sh) : null,
    dock: o.dock.enable.get() ? mkPlugin(Dock) : null,
    default: mkPlugin(Default),
  }));
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
