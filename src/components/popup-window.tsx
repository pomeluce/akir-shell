import PopupPadding from './popup-padding';
import { Astal, Gdk, Gtk } from 'ags/gtk4';
import { LayoutType, PopupWindowProps } from '@/types/element';
import { Accessor, Node, createComputed } from 'gnim';
import { cnames, fake } from '@/support/utils';
import { scss } from '@/theme/theme';
import app from 'ags/gtk4/app';

function Layout({ children: child, position, onClick }: { position: LayoutType | Accessor<LayoutType>; onClick: () => void; children: Node | Node[] }) {
  position instanceof Accessor && (position = position.get());
  const children = Array.isArray(child) ? child[0] : child;

  switch (position) {
    case 'top':
      return (
        <box orientation={Gtk.Orientation.VERTICAL}>
          {children}
          <PopupPadding h v onClick={onClick} />
        </box>
      );
    case 'top_center':
      return (
        <box>
          <PopupPadding h v onClick={onClick} />
          <box orientation={Gtk.Orientation.VERTICAL} hexpand={false}>
            {children}
            <PopupPadding h v onClick={onClick} />
          </box>
          <PopupPadding h v onClick={onClick} />
        </box>
      );
    case 'top_left':
      return (
        <box>
          <box orientation={Gtk.Orientation.VERTICAL} hexpand={false}>
            {children}
            <PopupPadding h v onClick={onClick} />
          </box>
          <PopupPadding h v onClick={onClick} />
        </box>
      );
    case 'top_right':
      return (
        <box>
          <PopupPadding h v onClick={onClick} />
          <box orientation={Gtk.Orientation.VERTICAL} hexpand={false}>
            {children}
            <PopupPadding h v onClick={onClick} />
          </box>
        </box>
      );
    case 'bottom':
      return (
        <box orientation={Gtk.Orientation.VERTICAL}>
          <PopupPadding h v onClick={onClick} />
          {children}
        </box>
      );
    case 'bottom_center':
      return (
        <box>
          <PopupPadding h v onClick={onClick} />
          <box orientation={Gtk.Orientation.VERTICAL} hexpand={false}>
            <PopupPadding h v onClick={onClick} />
            {children}
          </box>
          <PopupPadding h v onClick={onClick} />
        </box>
      );
    case 'bottom_left':
      return (
        <box>
          <box orientation={Gtk.Orientation.VERTICAL} hexpand={false}>
            <PopupPadding h v onClick={onClick} />
            {children}
          </box>
          <PopupPadding h v onClick={onClick} />
        </box>
      );
    case 'bottom_right':
      return (
        <box>
          <PopupPadding h v onClick={onClick} />
          <box orientation={Gtk.Orientation.VERTICAL} hexpand={false}>
            <PopupPadding h v onClick={onClick} />
            {children}
          </box>
        </box>
      );
    //default to center
    default:
      return (
        <box>
          <PopupPadding h v onClick={onClick} />
          <box orientation={Gtk.Orientation.VERTICAL}>
            <PopupPadding h v onClick={onClick} />
            <box>
              <PopupPadding h v onClick={onClick} />
              <box orientation={Gtk.Orientation.VERTICAL}>
                <PopupPadding h v onClick={onClick} />
                {children}
                <PopupPadding h v onClick={onClick} />
              </box>
              <PopupPadding h v onClick={onClick} />
            </box>
            <PopupPadding h v onClick={onClick} />
          </box>
          <PopupPadding h v onClick={onClick} />
        </box>
      );
  }
}

export default (props: PopupWindowProps) => {
  const {
    name,
    children,
    shade = false,
    visible = false,
    class: cname = '',
    namespace = 'akirds-popup',
    position = 'center',
    exclusivity = Astal.Exclusivity.IGNORE,
    ...prop
  } = props;

  const hide = () => app.get_window(name)?.hide();
  const classes = createComputed([fake(cname), fake(shade)], (cn, shade) => cnames('popup-window', cn, { shade }));
  const { TOP, RIGHT, BOTTOM, LEFT } = Astal.WindowAnchor;

  return (
    <window
      visible={visible}
      class={classes}
      name={name}
      namespace={namespace}
      keymode={Astal.Keymode.EXCLUSIVE}
      anchor={TOP | BOTTOM | RIGHT | LEFT}
      exclusivity={exclusivity}
      application={app}
      $={self => {
        const ctrl = new Gtk.EventControllerKey();
        ctrl.connect('key-pressed', (_, keyval) => {
          if (keyval === Gdk.KEY_Escape) hide();
        });
        self.add_controller(ctrl);
      }}
      {...prop}
    >
      <Layout position={position} onClick={hide} children={children} />
    </window>
  );
};

void scss`.popup-window {
  all: unset;
  border: none;
  box-shadow: none;

  &.shade {
    background-color: rgba(0,0,0,.4);
  }
}`;
