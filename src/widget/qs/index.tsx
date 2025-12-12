import GObject from 'gnim/gobject';
import Brightness from './brightness';
import Header from './header';
import { Box, PopupBin, PopupWindow } from '@/components';
import { Astal, Gtk } from 'ags/gtk4';
import { AppMixer, Microphone, SinkSelector, Volume } from './volume';
import { Network, WifiSelection } from './network';
import { Bluetooth, BluetoothDevices } from './bluetooth';
import { DarkMode } from './darkmode';
import { ThemeColor, ThemeColorSelection } from './theme-color';
import { MicMute } from './mic-mute';
import { DND } from './dnd';
import { Media } from './media';
import { scss } from '@/theme/style';
import { createComputed, createRoot } from 'gnim';
import { configs } from 'options';

const {
  bar,
  quicksettings: { width, position },
} = configs;
const layout = createComputed(() => `${bar.anchor()}_${position()}` as const);

const SiderBox = () => (
  <Box class="raised" valign={FILL} vertical px="2xl" py="2xl" gap="2xl" r="2xl">
    <Row buttons={[Volume]} menus={[SinkSelector, AppMixer]} />
    <Microphone />
    <Brightness />
  </Box>
);

const Row = ({ buttons = [], menus = [] }: { buttons?: Array<() => GObject.Object>; menus?: Array<() => GObject.Object> }) => (
  <Box vertical>
    <Box gap="xl" homogeneous>
      {...buttons.map(Button => <Button />)}
    </Box>
    {...menus.map(Menu => <Menu />)}
  </Box>
);

export default () =>
  createRoot(() => {
    return (
      <PopupWindow name="quicksettings" namespace="akirds-qs" position={layout} exclusivity={Astal.Exclusivity.EXCLUSIVE} css={width(w => `min-width: ${w}px;`)}>
        <PopupBin r="md">
          <box orientation={Gtk.Orientation.VERTICAL} class="quick-settings">
            <Header />
            <Box vertical py="xl" px="2xl" gap="xl">
              <SiderBox />
              <Box vertical py="xl" gap="2xl">
                <Row buttons={[Network, Bluetooth]} menus={[WifiSelection, BluetoothDevices]} />
                <Row buttons={[ThemeColor, DarkMode]} menus={[ThemeColorSelection]} />
                <Row buttons={[MicMute, DND]} />
                <Media />
              </Box>
            </Box>
          </box>
        </PopupBin>
      </PopupWindow>
    );
  });

void scss`.quick-settings {
  padding: 0 $padding * .25;

  & button {
    all: unset;
  }

  .header .avatar {
    border-radius: $radius * 5;
  }

  .qs-toggle-button,
  .qs-simple-toggle-button {
    &.active {
      background-color: $primary;
      color: $accent-fg;
    }

    button {
      padding: $padding *.5;
    }
  }

  .qs-menu {
    margin-top: $padding * .5;

    button.theme-color {
      transition: $transition;
      border-radius: $radius;
      background-color: currentColor;
      min-height: 1.5rem;
      min-width: 1.8rem;
      border: $border;
      margin: $spacing * .5;

      outline-color: transparent;
      outline-style: solid;
      outline-width: $border-width;
      outline-offset: $border-width;
      // -gtk-outline-radius: $radius + ($border-width * 2);

      &:focus,
      &:hover,
      &:active {
        outline-color: currentColor;
      }

      &.active {
        box-shadow: inset 0 0 0 $border-width $accent-fg;
      }
    }
  }
}`;
