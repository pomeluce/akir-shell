import Binding from 'astal/binding';
import Variable from 'astal/variable';
import { Widget } from 'astal/gtk3';
import { scss } from 'core/theme';
import { cnames, fake } from 'core/lib/utils';
import { Size } from '../theme';

type Color = 'regular' | 'primary' | 'success' | 'error';

export type ButtonProps = Widget.ButtonProps &
  Partial<{
    flat: boolean | Binding<boolean>;
    m: Size;
    mx: Size;
    my: Size;
    r: Size;
    hfill: boolean;
    vfill: boolean;
    suggested: boolean | Binding<boolean>;
    color: Color | Binding<Color>;
  }>;

export default function Button({
  child,
  flat = false,
  m,
  mx,
  my,
  r = 'lg',
  vfill = false,
  hfill = false,
  suggested = false,
  className = '',
  color = 'regular',
  ...props
}: ButtonProps) {
  const names = Variable.derive([fake(color), fake(suggested), fake(className), fake(flat)], (color, suggested, name, flat) =>
    cnames('Button', name, color, suggested && 'suggested', m && `p-${m}`, mx && `px-${mx}`, my && `py-${my}`, r && `r-${r}`, flat && 'flat'),
  );

  return (
    <button onDestroy={() => names.drop()} className={names()} {...props}>
      <box halign={hfill ? FILL : CENTER} valign={vfill ? FILL : CENTER}>
        {child}
      </box>
    </button>
  );
}

void scss`
@mixin button($bg-color, $fg-color, $hover-bg, $hover-fg, $active-bg, $active-fg) {
  @include padding($spacing);

  &.r-sm>box { border-radius: $radius * .3; }
  &.r-md>box { border-radius: $radius * .6; }
  &.r-lg>box { border-radius: $radius * .9; }
  &.r-xl>box { border-radius: $radius * 1.2; }
  &.r-2xl>box { border-radius: $radius * 1.5; }

  >box {
    transition: $transition;
    color: transparentize($fg-color, 0.1);
  }

  &.flat>box{
    background-color: transparent;
    box-shadow: none;
  }

  &:not(.flat)>box {
    background-color: transparentize($bg-color, $widget-opacity);
    box-shadow: inset 0 0 0 $border-width $border-color;
  }

  &:focus>box {
    box-shadow: inset 0 0 0 $border-width $active-bg;
    background-color: transparentize($hover-bg, $hover-opacity);
    color: $hover-fg;
  }

  &:hover>box {
    box-shadow: inset 0 0 0 $border-width $border-color;
    background-color: transparentize($hover-bg, $hover-opacity);
    color: $hover-fg;
  }

  &.active,
  &:active,
  &:checked {
    >box {
      box-shadow: inset 0 0 0 $border-width $border-color;
      background-color: $active-bg;
      color: $accent-fg;
    }
  }

  &.active,
  &:checked {
    &:hover,
    &:focus {
      >box {
          box-shadow: inset 0 0 0 ($border-width*2) $accent-fg, inset 0 0 0 $border-width $primary;
      }
    }
  }
}

@mixin regular($bgc, $fgc) {
  @include button($fg, $fg, $bgc, $bgc, $bgc, $fgc)
}

@mixin suggest($bgc, $fgc) {
  @include button($bgc, $bgc, $bgc, $bgc, $bgc, $fgc)
}

button.Button {
  all: unset;

  &.regular:not(.suggested) { @include button($widget-bg, $fg, $widget-bg, $fg, $primary, $bg); }
  &.primary:not(.suggested) { @include regular($primary, $bg); }
  &.error:not(.suggested) { @include regular($error, $bg); }
  &.success:not(.suggested) { @include regular($success, $bg); }

  &.regular.suggested { @include button($widget-bg, $fg, $widget-bg, $fg, $primary, $bg); }
  &.primary.suggested { @include suggest($primary, $bg); }
  &.error.suggested { @include suggest($error, $bg); }
  &.success.suggested { @include suggest($success, $bg); }
}
`;
