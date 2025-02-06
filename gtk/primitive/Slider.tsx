import { Widget } from 'astal/gtk3';
import { scss } from 'core/theme';
import { cnames } from 'core/lib/utils';

type SliderProps = Widget.SliderProps &
  Partial<{
    slider: boolean;
    size: 'sm' | 'md' | 'lg';
    squared: boolean;
    color: 'regular' | 'primary';
    className: string;
  }>;

export default function Slider({ color = 'primary', className = '', size = 'lg', slider = false, squared = false, ...props }: SliderProps) {
  const names = cnames('Slider', className, color, size, slider && 'slider', squared && 'squared');

  return new Widget.Slider({
    className: names,
    expand: true,
    drawValue: false,
    ...props,
  });
}

void scss`
@mixin slider($size, $color) {
  &:not(.squared) {
    trough {
      border-radius: $radius;

      highlight,
      progress {
        border-radius: max($radius - $border-width, 0);
      }
    }
  }

  &:not(.slider) {
    slider {
      opacity: 0;
    }
  }

  slider {
    margin: ($size * -.7);
  }

  trough {
    transition: $transition;
    border: $border;
    background-color: transparentize($fg, $widget-opacity);
    min-height: $size;
    min-width: $size;

    highlight,
    progress {
      background-color: $color;
      min-height: $size;
      min-width: $size;
    }
  }

  &:hover trough {
    background-color: transparentize($color, $hover-opacity);
  }

  &:disabled {
    highlight,
    progress {
      background-color: transparentize($fg, 0.4);
    }
  }

  trough:focus {
    background-color: transparentize($color, $hover-opacity);
    box-shadow: inset 0 0 0 $border-width $primary;
  }

  &.slider {
    slider {
      background-color: $fg;
      border: $border;
      transition: $transition;
      border-radius: $radius;
      min-height: $size;
      min-width: $size;
    }

    &:hover slider {
      background-color: $fg;
      border-color: $border-color;

    }

    @if $shadows {
      slider {
        box-shadow: 1px 1px 3px 0 $shadow-color;
      }

      &:hover slider {
        box-shadow: 0 0 5px 0 $shadow-color;
      }
    }
  }
}

.Slider {
  all: unset;
  * { all: unset; }

  &.regular.sm { @include slider(.4rem, $fg) }
  &.regular.md { @include slider(.6rem, $fg) }
  &.regular.lg { @include slider(.8rem, $fg) }

  &.primary.sm { @include slider(.4rem, $primary) }
  &.primary.md { @include slider(.6rem, $primary) }
  &.primary.lg { @include slider(.8rem, $primary) }
}
`;
