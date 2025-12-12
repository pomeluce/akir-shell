import AstalWp from 'gi://AstalWp?version=0.1';
import Pango from 'gi://Pango?version=1.0';
import { Box, Button, Icon, Separator, Slider } from '@/components';
import { QSMenu, QSToggleArrow } from './button';
import { createBinding, For } from 'gnim';
import { dependencies, sh } from '@/support/os';
import { configs } from 'options';
import app from 'ags/gtk4/app';

type Type = 'speaker' | 'microphone';

const { quicksettings } = configs;

const audio = AstalWp.get_default()!.audio;

const VolumeIndicator = ({ type = 'speaker' }: { type: Type }) => (
  <Button flat suggested onClicked={() => (audio[`default_${type}`].mute = !audio[`default_${type}`].mute)}>
    <Icon
      symbolic
      iconName={createBinding(audio[`default_${type}`], 'icon').as(name => name || 'microphone-sensitivity-high')}
      tooltipText={createBinding(audio[`default_${type}`], 'volume').as(vol => `Volume: ${Math.floor(vol * 100)}%`)}
    />
  </Button>
);

const VolumeSlider = ({ type = 'speaker' }: { type: Type }) => (
  <Slider
    value={createBinding(audio[`default_${type}`], 'volume')}
    onChangeValue={({ value }) => {
      audio[`default_${type}`].volume = value;
    }}
  />
);

export const Volume = () => (
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

export const Microphone = () => (
  <Box vexpand={false} px="md" gap="xl" visible={createBinding(audio, 'recorders').as(a => a.length > 0)}>
    <VolumeIndicator type="microphone" />
    <VolumeSlider type="microphone" />
  </Box>
);

export const SinkSelector = () => (
  <QSMenu name="sink-selector" icon="audio-headphones" title="Sink Selector">
    <Box vertical>
      <For each={createBinding(audio, 'speakers')}>{(s: AstalWp.Endpoint) => <SinkItem stream={s} />}</For>
    </Box>
    <Separator my="md" />
    <AudioSettings />
  </QSMenu>
);

function SinkItem({ stream }: { stream: AstalWp.Endpoint }) {
  return (
    <Box>
      <Button flat hfill onClicked={() => (stream.isDefault = true)}>
        <Box px="2xl" py="xl">
          <Icon symbolic class="primary" css="margin-right: .3em;" fallback="audio-speakers" iconName={createBinding(stream, 'icon')} />
          <label hexpand halign={START} label={createBinding(stream, 'description')} ellipsize={Pango.EllipsizeMode.END} singleLineMode maxWidthChars={35} />
          <Icon symbolic class="primary" css="margin-left: .3em;" halign={END} visible={createBinding(stream, 'isDefault')} iconName="object-select" />
        </Box>
      </Button>
    </Box>
  );
}

export const AppMixer = () => {
  const streams = createBinding(audio, 'streams');
  return (
    <QSMenu name="app-mixer" icon="mixer" title="App Mixer">
      <Box vertical gap="2xl" py="2xl" px="lg">
        {streams.length > 0 ? (
          <For each={streams}>
            {(s: AstalWp.Stream) => (
              <box>
                <MixerItem stream={s} />
              </box>
            )}
          </For>
        ) : (
          <box halign={CENTER}>No audio playing</box>
        )}
      </Box>
      <Separator my="md" />
      <AudioSettings />
    </QSMenu>
  );
};

function MixerItem({ stream }: { stream: AstalWp.Stream }) {
  const { mixer } = quicksettings.audio;

  return (
    <Box gap="md" class="mixer-item" vexpand={false}>
      <Icon symbolic size={mixer.names() ? 1.4 : 1} iconName={createBinding(stream, 'description').as(s => s.toLowerCase())} />
      <Box vertical gap="md">
        <box visible={mixer.names()}>
          <label class="name" halign={START} label={createBinding(stream, 'name')} ellipsize={Pango.EllipsizeMode.END} singleLineMode maxWidthChars={35} />
        </box>
        <Slider
          value={createBinding(stream, 'volume')}
          onChangeValue={({ value }) => {
            stream.volume = value;
          }}
        />
      </Box>
    </Box>
  );
}

const AudioSettings = () => (
  <button
    onClicked={() => {
      if (dependencies('gnome-control-center')) {
        sh(quicksettings.volume.peek());
        app.get_window('quicksettings')?.hide();
      }
    }}
  >
    <Box px="2xl" gap="md">
      <Icon symbolic iconName="applications-system" />
      <label label="Settings" />
    </Box>
  </button>
);
