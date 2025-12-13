import Tray from 'gi://AstalTray?version=0.1';
import PanelButton from './panel-button';
// import Gio from 'gi://Gio?version=2.0';
// import GObject from 'gnim/gobject';
import { Gdk, Gtk } from 'ags/gtk4';
import { Icon } from '@/components';
import { createBinding, createComputed, For } from 'gnim';
import { configs } from 'options';

const { bar } = configs;

const Item = (item: Tray.TrayItem) => {
  return (
    <box>
      <PanelButton
        flat={bar.systray.flat()}
        tooltipText={createBinding(item, 'tooltipMarkup')}
        $={self => {
          const menuButton = new Gtk.MenuButton({
            hasFrame: false,
          });

          const popover = Gtk.PopoverMenu.new_from_model(createBinding(item, 'menuModel')());
          popover.hasArrow = false;
          popover.insert_action_group('dbusmenu', createBinding(item, 'actionGroup')());

          menuButton.set_popover(popover);
          menuButton.set_parent(self);

          const gestureClick = Gtk.GestureClick.new();
          gestureClick.set_button(0);
          self.add_controller(gestureClick);

          gestureClick.connect('released', (_gesture, _n, x, y) => {
            const btn = gestureClick.get_current_button();

            if (btn === Gdk.BUTTON_PRIMARY) {
              item.activate(x, y);
              return;
            }

            if (btn === Gdk.BUTTON_SECONDARY) {
              item.about_to_show();
              menuButton.popup();
            }
          });

          self.connect('destroy', () => {
            menuButton.unparent();
          });
        }}
      >
        <Icon gicon={createBinding(item, 'gicon')} />
        {/* {popover} */}
      </PanelButton>
    </box>
  );
  // return (
  //   <box>
  //     <With value={createComputed(() => [createBinding(item, 'actionGroup')(), createBinding(item, 'menuModel')()])}>
  //       {([actionGroup, menuModel]: [Gio.ActionGroup, Gio.MenuModel]) => {
  //         // const popover = Gtk.PopoverMenu.new_from_model(menuModel);
  //         // popover.insert_action_group('dbusmenu', actionGroup);
  //         // popover.hasArrow = false;
  //
  //         return (
  //           <PanelButton
  //             flat={bar.systray.flat()}
  //             tooltipText={createBinding(item, 'tooltipMarkup')}
  //             $={self => {
  //               const conns: Map<GObject.Object, number> = new Map();
  //               const gestureClick = Gtk.GestureClick.new();
  //               gestureClick.set_button(0);
  //
  //               self.add_controller(gestureClick);
  //
  //               conns.set(
  //                 gestureClick,
  //                 gestureClick.connect('released', (gesture, _, x, y) => {
  //                   if (gesture.get_current_button() === Gdk.BUTTON_PRIMARY) {
  //                     item.activate(x, y);
  //                     return;
  //                   }
  //
  //                   if (gesture.get_current_button() === Gdk.BUTTON_SECONDARY) {
  //                     item.about_to_show();
  //
  //                     popover.popup();
  //                   }
  //                 }),
  //               );
  //             }}
  //           >
  //             <Icon gicon={createBinding(item, 'gicon')} />
  //             {/* {popover} */}
  //           </PanelButton>
  //         );
  //       }}
  //     </With>
  //   </box>
  // );
};

export default () => {
  const items = createComputed(() => {
    const ignore = bar.systray.ignore;
    const items = createBinding(Tray.get_default(), 'items');
    return items().filter(i => !ignore().includes(i.id));
  });

  return (
    <box>
      <For each={items}>{Item}</For>
    </box>
  );
};
