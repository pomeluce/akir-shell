import { Astal, Gtk } from 'astal/gtk3';
import PopupBin from 'gtk/primitive/PopupBin';
import { scss } from 'core/theme';
import Header from './widgets/Header';
import Box from 'gtk/primitive/Box';
import { AppMixer, Microphone, SinkSelector, Volume } from './widgets/Volume';
import { Brightness } from './widgets/Brightness';
import { Network, WifiSelection } from './widgets/Network';
import { Bluetooth, BluetoothDevices } from './widgets/Bluetooth';
import { ThemeColor, ThemeColorSelection } from './widgets/ThemeColor';
import { DarkMode } from './widgets/DarkMode';
import { MicMute } from './widgets/MicMute';
import { DND } from './widgets/DND';
import { Media } from './widgets/Media';
import PopupWindow from 'gtk/primitive/PopupWindow';
import options from 'options';
import { derive } from 'astal';

void scss`.QuickSettings {
  padding: 0 $padding;

  & button {
    all: unset;
  }

  .Header .Avatar {
    border-radius: $radius * 5;
  }

  .QSToggleButton,
  .QSSimpleToggleButton {
    &.active {
      background-color: $primary;
      color: $accent-fg;
    }

    button {
      padding: $padding *.5;
    }
  }

  .QSMenu {
    margin-top: $padding * .5;

    button.ThemeColor {
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
      -gtk-outline-radius: $radius + ($border-width * 2);

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

const {
  bar,
  quicksettings: { width, position },
} = options;
const layout = derive([bar.position, position], (bar, qs) => `${bar}_${qs}` as const);

const SiderBox = () => (
  <Box className="raised" valign={FILL} vertical px="2xl" py="2xl" gap="2xl" r="2xl">
    <Row buttons={[Volume]} menus={[SinkSelector, AppMixer]} />
    <Microphone />
    <Brightness />
  </Box>
);

const Row = ({ buttons = [], menus = [] }: { buttons?: Array<() => Gtk.Widget>; menus?: Array<() => Gtk.Widget> }) => (
  <Box vertical>
    <Box gap="xl" homogeneous>
      {...buttons.map(Button => <Button />)}
    </Box>
    {...menus.map(Menu => <Menu />)}
  </Box>
);

export default function QuickSettings() {
  return (
    <PopupWindow name="quicksettings" position={layout()} exclusivity={Astal.Exclusivity.EXCLUSIVE} css={width(w => `min-width: ${w}px`)}>
      <PopupBin r="md">
        <box vertical className="QuickSettings">
          <Header />
          <Box vertical py="xl" px="2xl" gap="xl">
            <SiderBox />
            <Box vertical py="xl" gap="xl">
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
}
