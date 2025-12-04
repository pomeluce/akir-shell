import { Box, Icon } from '@/components';
import { cnames } from '@/support/utils';
import { scss } from '@/theme/theme';
import options from 'options';

void scss`window#powermenu .power-button {
  all: unset;
  background-color: transparent;
  box-shadow: none;
  outline: none;

  &.labels {
    margin-bottom: -.5em;
  }

  image {
    color: $fg;
    border-radius: $radius * 2.4;
    transition: $transition;
    background-color: transparentize($widget-bg, $widget-opacity);
    border: $border;
    padding: $padding * 2 $padding;
  }

  label {
    color: transparentize($fg, .1);
    font-weight: lighter;
  }

  &:hover {
    image {
      -gtk-icon-transform: scale(0.94);
      background-color: transparentize($fg, $hover-opacity);
    }

    label {
      color: $fg;
    }
  }

  &:focus {
    image {
      -gtk-icon-transform: scale(0.94);
      background-color: transparentize($fg, $hover-opacity);
      border-color: $primary
    }

    label {
      color: $primary;
    }
  }

  &:active {
    image {
      color: $bg;
      background-color: $primary;
    }
  }
}`;

type Props = {
  icon: string;
  label: string;
  onClick: () => void;
};

export default function PowerButton({ icon, label, onClick }: Props) {
  const { labels, iconSize } = options.powermenu;

  return (
    <Box p="2xl">
      <button vexpand hexpand class={labels()(labels => cnames({ labels }, 'power-button'))} onClicked={onClick}>
        <Box gap="xl" vertical>
          <Icon symbolic iconName={icon} pixelSize={iconSize().as(v => v * 10)} />
          <label
            visible={labels()}
            label={label}
            css={`
              font-weight: bold;
            `}
          />
        </Box>
      </button>
    </Box>
  );
}
