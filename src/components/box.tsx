import { Gtk } from 'ags/gtk4';
import { Accessor } from 'gnim';
import { BoxProps } from '@/types/element';
import { cnames, fake } from '@/support/utils';
import { scss } from '@/theme/style';

export default (props: BoxProps) => {
  const { gap, p, px, py, pt, pb, pl, pr, m, mx, my, mt, mb, ml, mr, r, class: cname = '', vertical = false, widget = false, ...prop } = props;
  const classes = fake(cname).as((cls: string | undefined) =>
    cnames(
      'box',
      cls,
      vertical ? 'vertical' : 'horizontal',
      widget && 'widget',
      gap ? `gap-${gap}` : 'no-gap',
      p && `p-${p}`,
      px && `px-${px}`,
      py && `py-${py}`,
      pt && `pt-${pt}`,
      pb && `pb-${pb}`,
      pl && `pl-${pl}`,
      pr && `pr-${pr}`,
      m && `m-${m}`,
      mx && `mx-${mx}`,
      my && `my-${my}`,
      mt && `mt-${mt}`,
      mb && `mb-${mb}`,
      ml && `ml-${ml}`,
      mr && `mr-${mr}`,
      r && `r-${r}`,
    ),
  );

  return <box class={classes} orientation={vertical ? Gtk.Orientation.VERTICAL : Gtk.Orientation.HORIZONTAL} {...prop} />;
};

void scss`box.box {
  @include margin;
  @include padding;
  @include radius;

  &.raised {
    background-color: transparentize($widget-bg, $widget-opacity);
    box-shadow: inset 0 0 0 $border-width $border-color;
  }

  &.horizontal {
    &.gap-sm>* { margin: 0 ($spacing * .1); }
    &.gap-md>* { margin: 0 ($spacing * .2); }
    &.gap-lg>* { margin: 0 ($spacing * .3); }
    &.gap-xl>* { margin: 0 ($spacing * .4); }
    &.gap-2xl>* { margin: 0 ($spacing * .5); }

    &:not(.no-gap) {
      &>*:first-child { margin-left: 0; }
      &>*:last-child { margin-right: 0; }
    }
  }

  &.vertical {
    &.gap-sm>* { margin: ($spacing * .1) 0; }
    &.gap-md>* { margin: ($spacing * .2) 0; }
    &.gap-lg>* { margin: ($spacing * .3) 0; }
    &.gap-xl>* { margin: ($spacing * .4) 0; }
    &.gap-2xl>* { margin: ($spacing * .5) 0; }

    &:not(.no-gap) {
      &>*:first-child { margin-top: 0; }
      &>*:last-child { margin-bottom: 0; }
    }
  }
}`;
