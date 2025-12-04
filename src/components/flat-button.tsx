import { FlatButtonProps } from '@/types/element';
import { cnames, fake } from '@/support/utils';
import { createComputed } from 'gnim';
import { scss } from '@/theme/theme';

export default ({ color = 'primary', class: cname = '', ...props }: FlatButtonProps) => {
  const classes = createComputed([fake(color), fake(cname)], (c, n) => cnames('flat-button', c, n));
  return <button class={classes} {...props} />;
};

void scss`
@mixin flat-button ($color) {
  image {
    color: $color;
    &.flat { color: transparentize($color, .2) }
  }

  label {
    color: $fg;
    &.flat { color: transparentize($fg, .6) }
  }

  &:hover,
  &:focus {
    image {
      color: $color;
      &.flat { color: transparentize($color, .1) }
    }

    label {
      color: $color;
      &.flat { color: transparentize($color, .3) }
    }
  }

  &:active {
    label, image {
      color: $color;
      &.flat { color: $color; }
    }
  }
}

button.flat-button {
  all: unset;

  @include flat-button($fg);

  &.primary { @include flat-button($primary) }
  &.error { @include flat-button($error) }
  &.success { @include flat-button($success) }
}
`;
