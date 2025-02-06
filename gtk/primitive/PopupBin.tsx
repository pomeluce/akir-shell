import { Widget } from 'astal/gtk3';
import { Size } from '../theme';
import { scss } from 'core/theme';
import { cnames } from 'core/lib/utils';

type PopupBinProps = Widget.BoxProps &
  Partial<{
    p: Size;
    r: Size | '3xl' | '4xl';
    className: string;
  }>;

export default function PopupBin({ child, p, r, className = '', ...props }: PopupBinProps) {
  const names = cnames('PopupBin', className, p && `p-${p}`, r && `r-${r}`);

  return (
    <box className={names} {...props}>
      {child}
    </box>
  );
}

void scss`box.PopupBin {
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
