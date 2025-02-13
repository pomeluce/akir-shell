import { bind, Variable } from 'astal';
import { App, Astal, Gdk } from 'astal/gtk3';
import { appLunch } from 'core/lib/app';
import { sh } from 'core/lib/os';
import { scss } from 'core/theme';
import Apps from 'gi://AstalApps';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import Box from 'gtk/primitive/Box';
import Button from 'gtk/primitive/Button';
import Icon from 'gtk/primitive/Icon';
import PopupBin from 'gtk/primitive/PopupBin';
import Separator from 'gtk/primitive/Separator';
import options from 'options';

void scss`.Dock {
  separator.Separator {
    @include margin;

    min-width: $border-width * 5;
    min-height: $border-width;
    background-color: $border-color;
    border-radius: 5px;
  }
}`;

const { anchor, display, action, icon } = options.dock;

const hyprland = AstalHyprland.get_default();
const visibility = () => hyprland.get_workspace(hyprland.get_focused_workspace().id)?.get_clients().length <= 0;
const visible = Variable(visibility());

function DockAppButton(app: Apps.Application) {
  return (
    <Button flat hfill tooltipText={bind(app, 'name')} onClicked={() => appLunch(app)}>
      <Box p="xl">
        <Icon hexpand symbolic={icon.monochrome()} size={icon.size()} halign={CENTER} icon={bind(app, 'iconName')} fallback="Application-x-executable" />
      </Box>
    </Button>
  );
}

export default function Dock(monitor: Gdk.Monitor) {
  const { TOP, BOTTOM } = Astal.WindowAnchor;

  const show = display.get();
  const apps = new Apps.Apps();
  const dockApps = Variable<Apps.Application[]>(typeof show === 'number' ? apps.get_list().slice(0, show) : show.map(f => apps.exact_query(f)[0]));

  visible.observe(hyprland, 'notify::clients', () => visibility()).observe(hyprland, 'notify::focused-workspace', () => visibility());

  return (
    <window
      visible={visible()}
      className="Dock"
      css="background-color: transparent"
      name={`dock-${monitor.model}`}
      namespace="dock"
      application={App}
      gdkmonitor={monitor}
      anchor={anchor(v => (v === 'top' ? TOP : BOTTOM))}
      exclusivity={Astal.Exclusivity.IGNORE}
      onDestroy={() => visible.drop()}
    >
      <box vertical hexpand={false} className="Dock">
        <PopupBin r="2xl">
          <Box p="xl" gap="xl">
            <Box gap="lg">{dockApps(apps => apps.map(DockAppButton))}</Box>
            <Separator vertical />
            <Button vfill flat suggested color="primary" onClicked={() => sh(action.get())}>
              <Box px="xl">
                <Icon symbolic icon="view-grid" size={icon.size()} />
              </Box>
            </Button>
          </Box>
        </PopupBin>
      </box>
    </window>
  );
}
