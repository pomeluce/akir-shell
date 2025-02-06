import { Gtk, astalify, ConstructProps } from 'astal/gtk3';
import { property, register } from 'astal/gobject';

type GridProps = ConstructProps<
  Grid,
  Gtk.Grid.ConstructorProps & {
    breakpoint: number;
    vertical: boolean;
  }
>;

@register({ GTypeName: 'Fixed' })
export default class Grid extends astalify(Gtk.Grid) {
  @property(Number) declare breakpoint: number;

  @property(Boolean)
  get vertical() {
    return this.orientation == Gtk.Orientation.VERTICAL;
  }

  set vertical(v: boolean) {
    this.orientation = Gtk.Orientation[v ? 'VERTICAL' : 'HORIZONTAL'];
  }

  add(child: Gtk.Widget) {
    const { length } = this.get_children();
    const x = length % this.breakpoint;
    const y = Math.floor(length / this.breakpoint);
    const row = this.vertical ? y : x;
    const col = this.vertical ? x : y;
    this.attach(child, row, col, 1, 1);
  }

  private reset_children(children = this.get_children()) {
    for (const ch of children) {
      this.remove(ch);
    }

    for (const ch of children) this.add(ch);
  }

  constructor({ breakpoint = 5, ...props }: GridProps) {
    super({ breakpoint, ...props } as any);
    this.connect('notify::breakpoint', this.reset_children.bind(this));
    this.reset_children();
  }
}
