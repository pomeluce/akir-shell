import { GridProps } from '@/types/element';
import { Gtk } from 'ags/gtk4';
import { getter, property, register } from 'gnim/gobject';

@register({ GTypeName: 'Fixed' })
export default class Grid extends Gtk.Grid {
  @property(Number) breakpoint: number = 5;

  @getter(Boolean)
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

  private get_children(): Gtk.Widget[] {
    const children: Gtk.Widget[] = [];

    for (let child = this.get_first_child(); child; child = child.get_next_sibling()) {
      children.push(child);
    }

    return children;
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
