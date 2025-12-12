import Battery from './battery';
import ColorPicker from './color-picker';
import Launcher from './launcher';
import Workspace from './workspace';
import Taskbar from './taskbar';
import Date from './date';
import Systray from './systray';
import Sysindicators from './sysindicators';
import Powermenu from './powermenu';
import Media from './media';
import Screenrecord from './screenrecord';
import Messages from './messages';
import { Astal, Gdk } from 'ags/gtk4';
import { createComputed, createRoot, For } from 'gnim';
import { cnames } from '@/support/utils';
import { scss } from '@/theme/style';
import app from 'ags/gtk4/app';
import { configs } from 'options';

void scss`.bar .panel {
  &.bold label { font-weight: bold; }

  &:not(.bold) label { font-weight: normal; }

  &.transparent {
    background-color: transparent;

    label { text-shadow: $text-shadow; }
    image { -gtk-icon-shadow: $text-shadow; }
  }

  &:not(.transparent) {
    background-color: $bg;

    label { text-shadow: none; }
    image { -gtk-icon-shadow: none; }
  }
}`;

const widget: Record<BarWidget, () => JSX.Element> = {
  battery: Battery,
  colorpicker: ColorPicker,
  date: Date,
  launcher: Launcher,
  media: Media,
  powermenu: Powermenu,
  systray: Systray,
  system: Sysindicators,
  taskbar: Taskbar,
  workspaces: Workspace,
  screenrecord: Screenrecord,
  messages: Messages,
  spacer: () => <box hexpand />,
};

export default (monitor: Gdk.Monitor) =>
  createRoot(() => {
    const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;

    const top = TOP | LEFT | RIGHT;
    const bottom = BOTTOM | LEFT | RIGHT;

    const {
      transparent,
      bold,
      anchor,
      layout: { start, center, end },
    } = configs.bar;

    const classes = createComputed(() => cnames('panel', { transparent: transparent(), bold: bold() }));

    return (
      <window
        visible
        class="bar"
        name={`bar-${monitor.connector}`}
        namespace="akirds-bar"
        gdkmonitor={monitor}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={anchor(v => (v === 'top' ? top : bottom))}
        application={app}
      >
        <centerbox class={classes}>
          <box $type="start" hexpand>
            <For each={start}>{w => widget[w]()}</For>
          </box>
          <box $type="center" halign={CENTER}>
            <For each={center}>{w => widget[w]()}</For>
          </box>
          <box $type="end">
            <For each={end}>{w => widget[w]()}</For>
          </box>
        </centerbox>
      </window>
    );
  });

export { default as Corners } from './corners';
