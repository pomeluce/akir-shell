import Wp from 'gi://AstalWp';
import { bind } from 'astal';
import Icon from 'gtk/primitive/Icon';
import Slider from 'gtk/primitive/Slider';
import Box from 'gtk/primitive/Box';
import Button from 'gtk/primitive/Button';
import { QSMenu, QSToggleArrow } from '../QSButton';
import Separator from 'gtk/primitive/Separator';
import { dependencies, sh } from 'core/lib/os';
import options from 'options';

const { quicksettings } = options;

const audio = Wp.get_default()!.audio;

type Type = 'speaker' | 'microphone';

const VolumeIndicator = ({ type = 'speaker' }: { type: Type }) => (
  <Button flat suggested onClicked={() => (audio[`default_${type}`].mute = !audio[`default_${type}`].mute)}>
    <Icon
      symbolic
      icon={bind(audio[`default_${type}`], 'icon').as(name => name || 'microphone-sensitivity-high')}
      tooltipText={bind(audio[`default_${type}`], 'volume').as(vol => `Volume: ${Math.floor(vol * 100)}%`)}
    />
  </Button>
);

const VolumeSlider = ({ type = 'speaker' }: { type: Type }) => (
  <Slider onDragged={({ value }) => (audio[`default_${type}`].volume = value)} value={bind(audio[`default_${type}`], 'volume')} />
);

export const Volume = () => {
  return (
    <Box vexpand={false} px="md" pt="2xl" gap="xl">
      <VolumeIndicator type="speaker" />
      <VolumeSlider type="speaker" />
      <Box>
        <QSToggleArrow name="sink-selector" />
      </Box>
      <Box>
        <QSToggleArrow name="app-mixer" />
      </Box>
    </Box>
  );
};

export const Microphone = () => (
  <Box vexpand={false} px="md" gap="xl" visible={bind(audio, 'recorders').as(a => a.length > 0)}>
    <VolumeIndicator type="microphone" />
    <VolumeSlider type="microphone" />
  </Box>
);

export const SinkSelector = () => (
  <QSMenu name="sink-selector" icon="audio-headphones" title="Sink Selector">
    <Box vertical>{bind(audio, 'speakers').as(ss => ss.map(s => <SinkItem stream={s} />))}</Box>
    <Separator my="md" />
    <AudioSettings />
  </QSMenu>
);

function SinkItem({ stream }: { stream: Wp.Endpoint }) {
  return (
    <Box>
      <Button flat hfill onClicked={() => (stream.isDefault = true)}>
        <Box px="2xl" py="xl">
          <Icon symbolic className="primary" css="margin-right: .3em" fallback="audio-speakers" icon={bind(stream, 'icon')} />
          <label truncate hexpand halign={START} label={bind(stream, 'description')} maxWidthChars={30} />
          <Icon symbolic className="primary" css="margin-left: .3em" halign={END} visible={bind(stream, 'isDefault')} icon="object-select" />
        </Box>
      </Button>
    </Box>
  );
}

export const AppMixer = () => (
  <QSMenu name="app-mixer" icon="mixer" title="App Mixer">
    <Box vertical gap="2xl" py="2xl" px="lg">
      {bind(audio, 'streams').as(ss =>
        ss.length > 0 ? (
          ss.map(s => (
            <box>
              <MixerItem stream={s} />
            </box>
          ))
        ) : (
          <box halign={CENTER}>No audio playing</box>
        ),
      )}
    </Box>
    <Separator my="md" />
    <AudioSettings />
  </QSMenu>
);

function MixerItem({ stream }: { stream: Wp.Endpoint }) {
  const { mixer } = quicksettings.audio;

  return (
    <Box gap="md" className="MixerItem" vexpand={false}>
      <Icon symbolic size={mixer.names() ? 1.4 : 1} icon={bind(stream, 'description').as(s => s.toLowerCase())} />
      <Box vertical gap="md">
        <box visible={mixer.names()}>
          <label className="name" truncate halign={START} label={bind(stream, 'name')} />
        </box>
        <Slider onDragged={({ value }) => (stream.volume = value)} value={bind(stream, 'volume')} />
      </Box>
    </Box>
  );
}

const AudioSettings = () => (
  <button
    onClicked={() => {
      if (dependencies('gnome-control-center')) sh(quicksettings.volume.get());
    }}
  >
    <Box px="2xl" gap="md">
      <Icon symbolic icon="emblem-system" />
      <label label="Settings" />
    </Box>
  </button>
);
