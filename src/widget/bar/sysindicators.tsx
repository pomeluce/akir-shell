import Notifd from 'gi://AstalNotifd?version=0.1';
import Bluetooth from 'gi://AstalBluetooth?version=0.1';
import Network from 'gi://AstalNetwork?version=0.1';
import Wp from 'gi://AstalWp?version=0.1';
import PanelButton from './panel-button';
import { Gtk } from 'ags/gtk4';
import { Box, Icon } from '@/components';
import { createBinding, createComputed } from 'gnim';
import { throttle } from '@/support/function';
import { sh } from '@/support/os';
import { configs } from 'options';

const notifd = Notifd.get_default();
const bluetooth = Bluetooth.get_default();
const audio = Wp.get_default().audio;
const network = Network.get_default();

const AudioIcon = () => {
  return <Icon symbolic iconName={createBinding(audio.defaultSpeaker, 'volumeIcon')} />;
};

const MicrophoneIcon = () => {
  const mic = audio.defaultMicrophone;

  const visible = createComputed(() => {
    const recorders = createBinding(audio, 'recorders');
    const mute = createBinding(mic, 'mute');
    return recorders().length > 0 || mute();
  });

  return <Icon symbolic visible={visible} iconName={createBinding(mic, 'volumeIcon')} />;
};

export default () => {
  const { WIFI, WIRED } = Network.Primary;
  const { flat, action, label } = configs.bar.systemIndicators;

  const wifi = createBinding(network, 'wifi').peek();
  const wired = createBinding(network, 'wired').peek();

  const scroll = throttle(100, (y: number) => {
    const s = audio.defaultSpeaker;
    if (y > 0 && s.volume < 0.05) return (s.volume = 0);

    if (y < 0 && s.volume === 0) return (s.volume = 0.05);

    if (y < 0) {
      if (s.volume + s.volume * 0.05 > 1) s.volume = 1;
      else s.volume += s.volume * 0.05;
    }

    if (y >= 0 && s.volume > 0) {
      if (s.volume - s.volume * 0.05 < 0) s.volume = 0;
      else s.volume -= s.volume * 0.05;
    }
  });

  return (
    <PanelButton
      winName="quicksettings"
      color="primary"
      flat={flat()}
      tooltipText={label()}
      onClicked={() => sh(action.peek())}
      $={self => {
        const ctrl = new Gtk.EventControllerScroll({ flags: Gtk.EventControllerScrollFlags.VERTICAL });
        ctrl.connect('scroll', (_ctrl, _dx, dy) => scroll(dy));
        self.add_controller(ctrl);
      }}
    >
      <Box gap="md">
        <Icon symbolic visible={createBinding(bluetooth, 'isPowered')} iconName="bluetooth-active" />
        <Icon symbolic visible={createBinding(notifd, 'dontDisturb')} iconName="notifications-disabled" />
        {wifi && <Icon symbolic iconName={createBinding(wifi, 'iconName')} visible={createBinding(network, 'primary').as(p => p === WIFI)} />}
        {wired && <Icon symbolic iconName={createBinding(wired, 'iconName')} visible={createBinding(network, 'primary').as(p => p === WIRED)} />}
        <AudioIcon />
        <MicrophoneIcon />
      </Box>
    </PanelButton>
  );
};
