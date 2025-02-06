import { Gdk, Gtk, hook } from 'astal/gtk3';
import { Variable, bind } from 'astal';
import Tray from 'gi://AstalTray';
import PanelButton from '../PanelButton';
import options from 'options';

const { bar } = options;

function Item(item: Tray.TrayItem) {
  const { flat } = bar.systray;

  let menu: Gtk.Menu;

  function createMenu() {
    if (menu) menu.destroy();
    menu = Gtk.Menu.new_from_model(item.menuModel);
    menu.insert_action_group('dbusmenu', item.actionGroup);
  }

  function setup(btn: Gtk.Widget) {
    hook(btn, item, 'notify::menu-model', createMenu);
    hook(btn, item, 'notify::action-group', createMenu);
    createMenu();
  }

  return (
    <PanelButton
      flat={flat()}
      tooltipMarkup={bind(item, 'tooltipMarkup')}
      setup={setup}
      onDestroy={() => {
        menu.destroy();
      }}
      onClickRelease={self => {
        menu.popup_at_widget(self, Gdk.Gravity.SOUTH, Gdk.Gravity.NORTH, null);
      }}
    >
      <icon gicon={bind(item, 'gicon')} />
    </PanelButton>
  );
}

export default function () {
  const items = Variable.derive([bind(Tray.get_default(), 'items'), bar.systray.ignore], (items, ignore) => items.filter(i => !ignore.includes(i.id)));

  return <box onDestroy={() => items.drop()}>{items(items => items.map(Item))}</box>;
}
