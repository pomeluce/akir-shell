import Box from 'gtk/primitive/Box';
import Icon from 'gtk/primitive/Icon';
import { scss } from 'core/theme';
import { cnames } from 'core/lib/utils';
import options from 'options';

void scss`window#powermenu .PowerButton {
  all: unset;
  background-color: transparent;
  box-shadow: none;
  outline: none;

  &.labels {
    margin-bottom: -.5em;
  }

  icon {
    color: $fg;
    border-radius: $radius * 2.4;
    transition: $transition;
    background-color: transparentize($widget-bg, $widget-opacity);
    border: $border;
    padding: $padding * 2;
  }

  label {
    color: transparentize($fg, .1);
    font-weight: lighter;
  }

  &:hover {
    icon {
      -gtk-icon-transform: scale(0.94);
      background-color: transparentize($fg, $hover-opacity);
    }

    label {
      color: $fg;
    }
  }

  &:focus {
    icon {
      -gtk-icon-transform: scale(0.94);
      background-color: transparentize($fg, $hover-opacity);
      border-color: $primary
    }

    label {
      color: $primary;
    }
  }

  &:active {
    icon {
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
      <button expand className={labels(labels => cnames({ labels }, 'PowerButton'))} onClicked={onClick}>
        <Box gap="xl" vertical>
          <Icon symbolic icon={icon} size={iconSize()} />
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
