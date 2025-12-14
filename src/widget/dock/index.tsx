import AstalApps from 'gi://AstalApps?version=0.1';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import { Box, Button, Icon, PopupBin, Separator } from '@/components';
import { Astal, Gdk, Gtk } from 'ags/gtk4';
import { sh } from '@/support/os';
import { createBinding, createComputed, createRoot, createState, For } from 'gnim';
import { configs } from 'options';
import { scss } from '@/theme/style';
import app from 'ags/gtk4/app';

const { anchor, display, action, icon } = configs.dock;

const hyprland = AstalHyprland.get_default();
const visibility = () => {
  const fcw = hyprland.get_focused_client()?.get_workspace();
  const id = fcw?.id ? fcw.id : hyprland.get_focused_workspace().id;
  return hyprland.get_workspace(id)?.get_clients().length <= 0;
};

function DockAppButton(app: AstalApps.Application) {
  return (
    <Button flat hfill tooltipText={createBinding(app, 'name')} onClicked={() => app.launch()}>
      <Box p="xl">
        <Icon hexpand symbolic={icon.monochrome()} pixelSize={icon.size() * 10} halign={CENTER} iconName={createBinding(app, 'iconName')} fallback="Application-x-executable" />
      </Box>
    </Button>
  );
}

export default (monitor: Gdk.Monitor) =>
  createRoot(() => {
    const { TOP, BOTTOM } = Astal.WindowAnchor;

    const apps = new AstalApps.Apps();
    const dockApps = createComputed(() => {
      const show = display();
      return typeof show === 'number' ? apps.get_list().slice(0, show) : show.map(f => apps.fuzzy_query(f)[0]);
    });

    const [visible, setVisible] = createState(visibility());

    hyprland.connect('notify::clients', () => setVisible(visibility()));
    hyprland.connect('notify::focused-workspace', () => setVisible(visibility()));
    hyprland.connect('notify::focused-client', () => setVisible(visibility()));

    return (
      <window
        visible={visible}
        css="background-color: transparent;"
        name={`dock`}
        namespace="akirds-dock"
        application={app}
        gdkmonitor={monitor}
        anchor={anchor(v => (v === 'top' ? TOP : BOTTOM))}
        exclusivity={Astal.Exclusivity.IGNORE}
      >
        <box orientation={Gtk.Orientation.VERTICAL} hexpand={false} class="dock">
          <PopupBin r="2xl">
            <Box p="xl" gap="xl">
              <Box gap="lg">
                <For each={dockApps}>{DockAppButton}</For>
              </Box>
              <Separator vertical />
              <Button vfill flat suggested color="primary" onClicked={() => sh(action.peek())}>
                <Box px="xl">
                  <Icon symbolic iconName="view-grid" pixelSize={icon.size() * 10} />
                </Box>
              </Button>
            </Box>
          </PopupBin>
        </box>
      </window>
    );
  });

void scss`.dock {
  separator.separator {
    @include margin;

    min-width: $border-width * 5;
    min-height: $border-width;
    background-color: $border-color;
    border-radius: 5px;
  }
}`;
