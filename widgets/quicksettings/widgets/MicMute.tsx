import Wp from 'gi://AstalWp';
import { QSSimpleToggleButton } from '../QSButton';
import { bind } from 'astal';

export const MicMute = () => {
  const { defaultMicrophone: microphone } = Wp.get_default()!.audio;

  return (
    <QSSimpleToggleButton
      state={bind(microphone, 'mute').as(v => v || false)}
      icon={bind(microphone, 'volumeIcon')}
      label={bind(microphone, 'mute').as(v => (v ? 'Muted' : 'Unmuted'))}
      onToggled={() => (microphone.mute = !microphone.mute)}
    />
  );
};
