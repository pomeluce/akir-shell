import { Accessable, Props } from '@/types/widget';
import { Gtk } from 'ags/gtk4';
import { Accessor, createComputed } from 'gnim';
import { icon, symbolic as $symbolic, initIcons, lookupIcon } from '@/support/icons';
import { fake } from '@/support/utils';
import options from 'options';

type IconProps = Props<Gtk.Image, Gtk.Image.ConstructorProps> & Partial<Accessable<{ fallback: string; size: number; symbolic: boolean }>>;

initIcons();

const { iconSize } = options.theme;

export default (props: IconProps) => {
  const { fallback = 'image-missing', size = 1, pixelSize = iconSize(), symbolic = false, iconName: iname, css = '', ...prop } = props;

  const style = createComputed([fake(css), fake(size)], (css, size) => `font-size: ${size}em; ${css + (css && !css.trim().endsWith(';') ? ';' : '')}`);
  const iconName = createComputed([fake(iname), fake(symbolic), fake(fallback)], (i, s, f) => icon($symbolic(i || f!, s!), $symbolic(f!, s!), name => !!lookupIcon(name)));

  return <image css={style} iconName={iconName} pixelSize={pixelSize} {...prop} />;
};
