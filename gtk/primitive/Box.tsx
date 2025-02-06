import { Widget } from 'astal/gtk3';
import { scss } from 'core/theme';
import { cnames, fake } from 'core/lib/utils';
import { Size } from '../theme';

export type BoxProps = Widget.BoxProps &
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
    className: string;
    vertical: boolean;
    widget: boolean;
  }>;

export default function Box({
  child,
  children = [],
  gap,
  p,
  px,
  py,
  pt,
  pb,
  pl,
  pr,
  m,
  mx,
  my,
  mt,
  mb,
  ml,
  mr,
  r,
  className = '',
  vertical = false,
  widget = false,
  ...props
}: BoxProps) {
  const names = fake(className).as((className: string | undefined) =>
    cnames(
      'Box',
      className,
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

  return (
    <box className={names} vertical={vertical} {...props}>
      {child || children}
    </box>
  );
}

void scss`box.Box {
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
