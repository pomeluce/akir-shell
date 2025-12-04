import { PopupBinProps } from '@/types/element';
import { cnames, fake } from '@/support/utils';
import { scss } from '@/theme/theme';

export default function PopupBin({ p, r, class: cname = '', ...props }: PopupBinProps) {
  const classes = fake(cname).as(c => cnames('popup-bin', c, p && `p-${p}`, r && `r-${r}`));

  return <box class={classes} {...props} />;
}

void scss`box.popup-bin {
  margin: 12px;
  border: $border-width solid color.mix($fg, $border-color, .4%);
  background-color: $bg;
  color: $fg;

  @include padding;

  &.r-sm { border-radius: $radius * 1.5; }
  &.r-md { border-radius: $radius * 1.8; }
  &.r-lg { border-radius: $radius * 2.1; }
  &.r-xl { border-radius: $radius * 2.4; }
  &.r-2xl { border-radius: $radius * 2.7; }
  &.r-3xl { border-radius: $radius * 3.0; }
  &.r-4xl { border-radius: $radius * 3.3; }

  @if $shadows {
    border: none;
    box-shadow: 2px 3px 6px 0 $shadow-color, inset 0 0 0 $border-width color.mix($fg, $border-color, .4%);
  }
}`;
