import { Gtk } from 'ags/gtk4';
import { Accessor, CCProps } from 'gnim';

type Props<T extends Gtk.Widget, Props> = CCProps<T, Partial<Props>>;

type Accessable<T> = { [K in keyof T]: T[K] extends Accessor<infer U> ? Accessor<U> : T[K] | Accessor<T[K]> };
