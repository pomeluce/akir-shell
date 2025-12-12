import { ButtonProps } from '@/types/element';
import { Accessor, createComputed } from 'gnim';
import { cnames, fake } from '@/support/utils';
import { scss } from '@/theme/style';

export default (props: ButtonProps) => {
  const { children, flat = false, p, px, py, r = 'lg', vfill = false, hfill = false, suggested = false, class: cname = '', color = 'regular', ...prop } = props;

  const classes = createComputed(() => {
    return cnames(
      'button',
      fake(cname)(),
      fake(color)(),
      fake(suggested)() && 'suggested',
      p && `p-${p}`,
      px && `px-${px}`,
      py && `py-${py}`,
      r && `r-${r}`,
      fake(flat)() && 'flat',
    );
  });

  return (
    <button class={classes} {...prop}>
      <box halign={hfill ? FILL : CENTER} valign={vfill ? FILL : CENTER} children={children} />
    </button>
  );
};

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

  // &:focus>box {
  //   box-shadow: inset 0 0 0 $border-width $active-bg;
  //   background-color: transparentize($hover-bg, $hover-opacity);
  //   color: $hover-fg;
  // }

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

  // &.active,
  // &:checked {
  //   &:hover,
  //   &:focus {
  //     >box {
  //         box-shadow: inset 0 0 0 ($border-width*2) $accent-fg, inset 0 0 0 $border-width $primary;
  //     }
  //   }
  // }
}

@mixin regular($bgc, $fgc) {
  @include button($fg, $fg, $bgc, $bgc, $bgc, $fgc)
}

@mixin suggest($bgc, $fgc) {
  @include button($bgc, $bgc, $bgc, $bgc, $bgc, $fgc)
}

button.button {
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
