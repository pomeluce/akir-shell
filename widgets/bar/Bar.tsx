import Date from './buttons/Date';
import Launcher from './buttons/Launcher';
import Workspaces from './buttons/Workspaces';
import PowerMenu from './buttons/PowerMenu';
import Taskbar from './buttons/Taskbar';
import Battery from './buttons/Battery';
import Media from './buttons/Media';
import SysTray from './buttons/SysTray';
import SystemIndicators from './buttons/SystemIndicators';
import Messages from './buttons/Messages';
import ScreenRecord from './buttons/ScreenRecord';
import ColorPicker from './buttons/ColorPicker';
import { Variable } from 'astal';
import { App, Astal, Gdk } from 'astal/gtk3';
import { scss } from 'core/theme';
import { cnames } from 'core/lib/utils';
import options from 'options';

void scss`.Bar .panel {
  &.bold label { font-weight: bold; }

  &:not(.bold) label { font-weight: normal; }

  &.transparent {
    background-color: transparent;

    label { text-shadow: $text-shadow; }
    icon { -gtk-icon-shadow: $text-shadow; }
  }

  &:not(.transparent) {
    background-color: $bg;

    label { text-shadow: none; }
    icon { -gtk-icon-shadow: none; }
  }
}`;

export type BarWidget =
  | 'launcher'
  | 'battery'
  | 'date'
  | 'launcher'
  | 'media'
  | 'powermenu'
  | 'colorpicker'
  | 'systray'
  | 'system'
  | 'taskbar' // Hyprland only
  | 'workspaces' // Hyprland only
  | 'screenrecord'
  | 'messages'
  | 'spacer';

const widget: Record<BarWidget, () => JSX.Element> = {
  battery: Battery,
  colorpicker: ColorPicker,
  date: Date,
  launcher: Launcher,
  media: Media,
  powermenu: PowerMenu,
  systray: SysTray,
  system: SystemIndicators,
  taskbar: Taskbar,
  workspaces: Workspaces,
  screenrecord: ScreenRecord,
  messages: Messages,
  spacer: () => <box expand />,
};

export default function Bar(monitor: Gdk.Monitor) {
  const lr = Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT;
  const top = Astal.WindowAnchor.TOP | lr;
  const bottom = Astal.WindowAnchor.BOTTOM | lr;

  const { transparent, bold, anchor, layout } = options.bar;
  const { start, center, end } = layout;

  const className = Variable.derive([transparent, bold], (t, b) =>
    cnames('panel', {
      transparent: t,
      bold: b,
    }),
  );

  return (
    <window
      className="Bar"
      name={`bar-${monitor.model}`}
      namespace="bar"
      application={App}
      gdkmonitor={monitor}
      anchor={anchor(p => (p === 'top' ? top : bottom))}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      onDestroy={() => className.drop()}
    >
      <centerbox className={className()}>
        <box hexpand>{start(s => s.map(w => widget[w]()))}</box>
        <box halign={CENTER}>{center(c => c.map(w => widget[w]()))}</box>
        <box hexpand>{end(e => e.map(w => widget[w]()))}</box>
      </centerbox>
    </window>
  );
}
