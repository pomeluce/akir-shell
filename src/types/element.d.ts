import { Gtk } from 'ags/gtk4';
import { Props } from './widget';
import { Accessor } from 'gnim';

type Color = 'regular' | 'primary' | 'success' | 'error';

type ButtonProps = Props<Gtk.Button, Gtk.Button.ConstructorProps> &
  Partial<{
    flat: boolean | Accessor<boolean>;
    p: Size;
    px: Size;
    py: Size;
    r: Size;
    hfill: boolean;
    vfill: boolean;
    suggested: boolean | Accessor<boolean>;
    color: Color | Accessor<Color>;
  }>;

type BoxProps = Props<Gtk.Box, Gtk.Box.ConstructorProps> &
  Partial<{
    gap: Size;
    p: Size;
    px: Size;
    py: Size;
    pt: Size;
    pb: Size;
    pr: Size;
    pl: Size;
    m: Size;
    mx: Size;
    my: Size;
    mt: Size;
    mb: Size;
    mr: Size;
    ml: Size;
    r: Size;
    class: string;
    vertical: boolean;
    widget: boolean;
  }>;
