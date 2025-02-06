import Binding from 'astal/binding';
import { Widget } from 'astal/gtk3';
import { scss } from 'core/theme';
import { cnames, fake } from 'core/lib/utils';

type Color = 'primary' | 'error' | 'success';

type FlatButtonProps = Widget.ButtonProps &
  Partial<{
    child: JSX.Element;
    color: Color | Binding<Color>;
    className: string;
  }>;

export default function FlatButton({ child, color = 'primary', className = '', ...props }: FlatButtonProps) {
  const names = fake(color).as(c => cnames('FlatButton', c, className));

  return (
    <button className={names} {...props}>
      {child}
    </button>
  );
}

void scss`
@mixin flat-button ($color) {
  icon {
    color: $color;
    &.flat { color: transparentize($color, .2) }
  }

  label {
    color: $fg;
    &.flat { color: transparentize($fg, .6) }
  }

  &:hover,
  &:focus {
    icon {
      color: $color;
      &.flat { color: transparentize($color, .1) }
    }

    label {
      color: $color;
      &.flat { color: transparentize($color, .3) }
    }
  }

  &:active {
    label, icon {
      color: $color;
      &.flat { color: $color; }
    }
  }
}

button.FlatButton {
  all: unset;

  @include flat-button($fg);

  &.primary { @include flat-button($primary) }
  &.error { @include flat-button($error) }
  &.success { @include flat-button($success) }
}
`;
