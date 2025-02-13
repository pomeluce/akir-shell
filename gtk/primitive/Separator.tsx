import { GObject } from 'astal';
import { Gtk, astalify, ConstructProps } from 'astal/gtk3';
import { cnames } from 'core/lib/utils';
import { scss } from 'core/theme';
import { Size } from '../theme';

void scss`separator.Separator {
  @include margin;

  min-width: $border-width;
  min-height: $border-width;
  background-color: $border-color;
}`;

class GtkSeparator extends astalify(Gtk.Separator) {
  static {
    GObject.registerClass({ GTypeName: 'Separator' }, this);
  }
  constructor(props?: ConstructProps<GtkSeparator, Gtk.Separator.ConstructorProps>) {
    super(props as any);
  }
}

type Props = Partial<{
  vertical: boolean;
  m: Size;
  my: Size;
  mx: Size;
  mt: Size;
  mb: Size;
  ml: Size;
  mr: Size;
}>;

export default function Separator({ vertical = false, m, my, mx, mt, mb, mr, ml }: Props) {
  const names = cnames('Separator', m && `m-${m}`, mx && `mx-${mx}`, my && `my-${my}`, mt && `mt-${mt}`, mb && `mb-${mb}`, ml && `ml-${ml}`, mr && `mr-${mr}`);

  return <GtkSeparator hexpand={!vertical} vexpand={vertical} className={names} orientation={vertical ? 1 : 0} />;
}
