import { Accessor } from 'gnim';
import { Gtk } from 'ags/gtk4';
import { fake, tmpl } from '@/support/utils';

type PaddingProps = {
  child?: JSX.Element;
  onClick: () => void;
  h?: boolean | Accessor<boolean>;
  v?: boolean | Accessor<boolean>;
  height?: number | Accessor<number>;
  width?: number | Accessor<number>;
};

export default ({ h = false, v = false, width = 0, height = 0, child, onClick }: PaddingProps) => {
  const size = tmpl`min-width: ${fake(width)}rem; min-height: ${fake(height)}rem;`;
  return (
    <box
      hexpand={h}
      vexpand={v}
      $={self => {
        const ctrl = new Gtk.GestureClick();
        ctrl.connect('released', onClick);
        self.add_controller(ctrl);
      }}
    >
      <box css={size}>{child}</box>
    </box>
  );
};
