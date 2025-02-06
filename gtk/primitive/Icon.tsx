import { App, Astal, type BindableProps, type Widget } from 'astal/gtk3';
import { icon as $icon, symbolic as $symbolic } from 'core/lib/icons';
import Variable from 'astal/variable';
import { fake } from 'core/lib/utils';
import { initIcons } from 'core/lib/icons';

initIcons(App);

type IconProps = Widget.IconProps & Partial<BindableProps<{ fallback: string; size: number; symbolic: boolean }>>;

export default function Icon({ fallback = 'image-missing', size = 1, symbolic = false, icon, css = '', ...props }: IconProps) {
  const style = Variable.derive([fake(css), fake(size)], (css, size) => `font-size: ${size}em; ${css};`);

  const iconName = Variable.derive([fake(icon), fake(symbolic), fake(fallback)], (i, s, f) =>
    $icon($symbolic(i || f!, s!), $symbolic(f!, s!), name => !!Astal.Icon.lookup_icon(name)),
  );

  return (
    <icon
      onDestroy={() => {
        style.drop();
        iconName.drop();
      }}
      icon={iconName()}
      css={style()}
      {...props}
    />
  );
}
