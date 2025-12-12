import { Accessable, Props } from '@/types/widget';
import { Gtk } from 'ags/gtk4';
import { Accessor, createComputed } from 'gnim';
import { icon, symbolic as $symbolic, initIcons, lookupIcon } from '@/support/icons';
import { fake } from '@/support/utils';
import { themes } from 'options';

type IconProps = Props<Gtk.Image, Gtk.Image.ConstructorProps> & Partial<Accessable<{ fallback: string; size: number; symbolic: boolean }>>;

initIcons();

const { iconSize } = themes;

export default (props: IconProps) => {
  const { fallback = 'image-missing', size = 1, pixelSize = iconSize(), symbolic = false, iconName: iname, css = '', ...prop } = props;

  const style = createComputed(() => `font-size: ${fake(size)()}em; ${fake(css)() + (fake(css)() && !fake(css)().trim().endsWith(';') ? ';' : '')}`);
  const iconName = createComputed(() =>
    icon($symbolic(fake(iname)() || fake(fallback)()!, fake(symbolic)()!), $symbolic(fake(fallback)()!, fake(symbolic)()!), name => !!lookupIcon(name)),
  );

  return <image css={style} iconName={iconName} pixelSize={pixelSize} {...prop} />;
};
