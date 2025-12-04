import { Astal, Gtk } from 'ags/gtk4';
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

type LayoutType = 'top' | 'top_center' | 'top_left' | 'top_right' | 'bottom' | 'bottom_center' | 'bottom_left' | 'bottom_right' | 'center';

type PopupWindowProps = Props<Astal.Window, Astal.Window.ConstructorProps> & {
  name: string;
  shade?: boolean | Accessor<boolean>;
  position?: LayoutType | Accessor<LayoutType>;
};

type PopupBinProps = Props<Gtk.Box, Gtk.Box.ConstructorProps> &
  Partial<{
    p: Size;
    r: Size | '3xl' | '4xl';
  }>;

type SliderProps = Props<Astal.Slider, Astal.Slider.ConstructorProps> &
  Partial<{
    slider: boolean;
    size: 'sm' | 'md' | 'lg';
    squared: boolean;
    color: 'regular' | 'primary';
  }>;

type SeparatorProps = Props<Gtk.Separator, Gtk.Separator.ConstructorProps> &
  Partial<{
    vertical: boolean;
    m: Size;
    my: Size;
    mx: Size;
    mt: Size;
    mb: Size;
    ml: Size;
    mr: Size;
  }>;

type FlatButtonProps = Props<Gtk.Button, Gtk.Button.ConstructorProps> & Partial<{ color: 'primary' | 'error' | 'success' | Accessor<'primary' | 'error' | 'success'> }>;
