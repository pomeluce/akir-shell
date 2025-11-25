import Tray from 'gi://AstalTray?version=0.1';
import PanelButton from './panel-button';
import Gio from 'gi://Gio?version=2.0';
import GObject from 'gnim/gobject';
import { Gdk, Gtk } from 'ags/gtk4';
import { Icon } from '@/components';
import { createBinding, createComputed, For, With } from 'gnim';
import options from 'options';

const { bar } = options;

const Item = (item: Tray.TrayItem) => {
  return (
    <box>
      <With value={createComputed([createBinding(item, 'actionGroup'), createBinding(item, 'menuModel')])}>
        {([actionGroup, menuModel]: [Gio.ActionGroup, Gio.MenuModel]) => {
          const popover = Gtk.PopoverMenu.new_from_model(menuModel);
          popover.insert_action_group('dbusmenu', actionGroup);
          popover.hasArrow = false;

          return (
            <PanelButton
              flat={bar.systray.flat()}
              tooltipText={createBinding(item, 'tooltipMarkup')}
              $={self => {
                const conns: Map<GObject.Object, number> = new Map();
                const gestureClick = Gtk.GestureClick.new();
                gestureClick.set_button(0);

                self.add_controller(gestureClick);

                conns.set(
                  gestureClick,
                  gestureClick.connect('released', (gesture, _, x, y) => {
                    if (gesture.get_current_button() === Gdk.BUTTON_PRIMARY) {
                      item.activate(x, y);
                      return;
                    }

                    if (gesture.get_current_button() === Gdk.BUTTON_SECONDARY) {
                      item.about_to_show();
                      popover.popup();
                    }
                  }),
                );
              }}
            >
              <Icon gicon={createBinding(item, 'gicon')} />
              {popover}
            </PanelButton>
          );
        }}
      </With>
    </box>
  );
};

export default () => {
  const items = createComputed([createBinding(Tray.get_default(), 'items'), bar.systray.ignore()], (items, ignore) => items.filter(i => !ignore.includes(i.id)));

  return (
    <box>
      <For each={items}>{Item}</For>
    </box>
  );
};
