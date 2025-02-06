import { Gtk, astalify, ConstructProps } from 'astal/gtk3';
import { register } from 'astal/gobject';

@register({ GTypeName: 'Fixed', CssName: 'fixed' })
export class Fixed extends astalify(Gtk.Fixed) {
  constructor(props: ConstructProps<Fixed, Gtk.Fixed.ConstructorProps>) {
    super(props as any);
  }
}
