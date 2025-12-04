import AstalWp from 'gi://AstalWp?version=0.1';
import { QSSimpleToggleButton } from './button';
import { createBinding } from 'gnim';

export const MicMute = () => {
  const { defaultMicrophone: microphone } = AstalWp.get_default()!.audio;

  return (
    <QSSimpleToggleButton
      state={createBinding(microphone, 'mute').as(v => v || false)}
      icon={createBinding(microphone, 'volumeIcon')}
      label={createBinding(microphone, 'mute').as(v => (v ? 'Muted' : 'Unmuted'))}
      onToggled={() => (microphone.mute = !microphone.mute)}
    />
  );
};
