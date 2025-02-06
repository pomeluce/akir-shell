import Box from 'gtk/primitive/Box';
import Notifd from 'gi://AstalNotifd';
import Bluetooth from 'gi://AstalBluetooth';
import Network from 'gi://AstalNetwork';
import PanelButton from '../PanelButton';
import Wp from 'gi://AstalWp';
import { bind, Variable } from 'astal';
import { sh } from 'core/lib/os';
import { throttle } from 'core/lib/function';
import options from '../options';
import Icon from 'gtk/primitive/Icon';

function AudioIcon() {
  const speaker = Wp.get_default()!.audio.defaultSpeaker;
  return <Icon symbolic icon={bind(speaker, 'volumeIcon')} />;
}

function MicrophoneIcon() {
  const { audio } = Wp.get_default()!;
  const mic = audio.defaultMicrophone;

  const visible = Variable.derive([bind(audio, 'recorders'), bind(mic, 'mute')], (rs, mute) => rs.length > 0 || mute)();

  return <Icon symbolic visible={visible} icon={bind(mic, 'volumeIcon')} />;
}

export default function () {
  const bluetooth = Bluetooth.get_default();
  const notifd = Notifd.get_default();
  const audio = Wp.get_default()!.audio;
  const network = Network.get_default();
  const { WIFI, WIRED } = Network.Primary;
  const { flat, action, label } = options.systemIndicators;

  const wifi = bind(network, 'wifi').get();
  const wired = bind(network, 'wired').get();

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
    <PanelButton winName="quicksettings" color="primary" flat={flat()} tooltipText={label()} onClicked={() => sh(action.get())} onScroll={(_, { delta_y }) => scroll(delta_y)}>
      <Box gap="md">
        <Icon symbolic visible={bind(bluetooth, 'isPowered')} icon="bluetooth-active" />
        <Icon symbolic visible={bind(notifd, 'dontDisturb')} icon="notifications-disabled" />
        {wifi && <Icon symbolic icon={bind(wifi, 'iconName')} visible={bind(network, 'primary').as(p => p === WIFI)} />}
        {wired && <Icon symbolic icon={bind(wired, 'iconName')} visible={bind(network, 'primary').as(p => p === WIRED)} />}
        <AudioIcon />
        <MicrophoneIcon />
      </Box>
    </PanelButton>
  );
}
