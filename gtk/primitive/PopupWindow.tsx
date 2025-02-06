import { Binding, derive } from 'astal';
import { App, Astal, Gdk, Gtk, Widget } from 'astal/gtk3';
import PopupPadding from './PopupPadding';
import { scss } from 'core/theme';
import { cnames, fake } from 'core/lib/utils';

void scss`.PopupWindow {
  all: unset;
  border: none;
  box-shadow: none;

  &.shade {
    background-color: rgba(0,0,0,.4);
  }
}`;

type LayoutType = 'top' | 'top_center' | 'top_left' | 'top_right' | 'bottom' | 'bottom_center' | 'bottom_left' | 'bottom_right' | 'center';

function Layout({ child, position, onClick }: { position: LayoutType | Binding<LayoutType>; onClick: () => void; child?: JSX.Element }) {
  position instanceof Binding && (position = position.get());
  switch (position) {
    case 'top':
      return (
        <box vertical>
          {child}
          <PopupPadding h v onClick={onClick} />
        </box>
      );
    case 'top_center':
      return (
        <box>
          <PopupPadding h v onClick={onClick} />
          <box vertical hexpand={false}>
            {child}
            <PopupPadding h v onClick={onClick} />
          </box>
          <PopupPadding h v onClick={onClick} />
        </box>
      );
    case 'top_left':
      return (
        <box>
          <box vertical hexpand={false}>
            {child}
            <PopupPadding h v onClick={onClick} />
          </box>
          <PopupPadding h v onClick={onClick} />
        </box>
      );
    case 'top_right':
      return (
        <box>
          <PopupPadding h v onClick={onClick} />
          <box vertical hexpand={false}>
            {child}
            <PopupPadding h v onClick={onClick} />
          </box>
        </box>
      );
    case 'bottom':
      return (
        <box vertical>
          <PopupPadding h v onClick={onClick} />
          {child}
        </box>
      );
    case 'bottom_center':
      return (
        <box>
          <PopupPadding h v onClick={onClick} />
          <box vertical hexpand={false}>
            <PopupPadding h v onClick={onClick} />
            {child}
          </box>
          <PopupPadding h v onClick={onClick} />
        </box>
      );
    case 'bottom_left':
      return (
        <box>
          <box vertical hexpand={false}>
            <PopupPadding h v onClick={onClick} />
            {child}
          </box>
          <PopupPadding h v onClick={onClick} />
        </box>
      );
    case 'bottom_right':
      return (
        <box>
          <PopupPadding h v onClick={onClick} />
          <box vertical hexpand={false}>
            <PopupPadding h v onClick={onClick} />
            {child}
          </box>
        </box>
      );
    //default to center
    default:
      return (
        <centerbox>
          <PopupPadding h v onClick={onClick} />
          <centerbox orientation={Gtk.Orientation.VERTICAL}>
            <PopupPadding h v onClick={onClick} />
            {child}
            <PopupPadding h v onClick={onClick} />
          </centerbox>
          <PopupPadding h v onClick={onClick} />
        </centerbox>
      );
  }
}

interface PopupWindowProps extends Widget.WindowProps {
  name: string;
  shade?: boolean | Binding<boolean>;
  child?: JSX.Element;
  position?: LayoutType | Binding<LayoutType>;
  namespace?: string;
}
export default function PopupWindow({
  name,
  child,
  shade = false,
  visible = false,
  className = '',
  namespace = 'PopupWindow',
  position = 'center',
  exclusivity = Astal.Exclusivity.IGNORE,
  ...props
}: PopupWindowProps) {
  const hide = () => App.get_window(name)!.hide();
  const names = derive([fake(className), fake(shade)], (cn, shade) => cnames('PopupWindow', cn, { shade }));

  const { TOP, RIGHT, BOTTOM, LEFT } = Astal.WindowAnchor;

  return (
    <window
      className={names()}
      namespace={namespace}
      visible={visible}
      name={name}
      application={App}
      exclusivity={exclusivity}
      keymode={Astal.Keymode.EXCLUSIVE}
      anchor={TOP | BOTTOM | RIGHT | LEFT}
      onKeyPressEvent={function (_, event: Gdk.Event) {
        if (event.get_keyval()[1] === Gdk.KEY_Escape) hide();
      }}
      {...props}
    >
      <Layout position={position} onClick={hide}>
        {child}
      </Layout>
    </window>
  );
}
