import Wp from 'gi://AstalWp';
import Box from 'gtk/primitive/Box';
import Separator from 'gtk/primitive/Separator';
import Slider from 'gtk/primitive/Slider';
import Button from 'gtk/primitive/Button';
import Icon from 'gtk/primitive/Icon';
import { scss } from 'core/theme';
import { bind, Variable } from 'astal';
import options from '../../options';

void scss`.Launcher .Mixer {
  .MixerItem {
    icon {
      font-size: 1.6em;
    }
  }
}`;

function MixerItem({ stream }: { stream: Wp.Endpoint }) {
  const { mixer } = options.audio;

  return (
    <Box px="2xl" gap="md" className="MixerItem" vexpand={false}>
      <Icon symbolic size={1.4} icon={bind(stream, 'description').as(s => s.toLowerCase())} />
      <Box vertical gap="md">
        <box visible={mixer.names()}>
          <label className="name" truncate halign={START} label={bind(stream, 'name')} />
        </box>
        <Slider onDragged={({ value }) => (stream.volume = value)} value={bind(stream, 'volume')} />
      </Box>
    </Box>
  );
}

function SinkItem(stream: Wp.Endpoint) {
  return (
    <Box px="2xl" className="SinkItem">
      <Button hfill onClicked={() => (stream.isDefault = true)}>
        <Box px="2xl" py="xl">
          <Icon symbolic className="primary" css="margin-right: .3em" fallback="audio-speakers" icon={bind(stream, 'icon')} />
          <label truncate hexpand halign={START} label={bind(stream, 'description')} />
          <Icon symbolic className="primary" css="margin-left: .3em" halign={END} visible={bind(stream, 'isDefault')} icon="object-select" />
        </Box>
      </Button>
    </Box>
  );
}

export default function Mixer(filter: Variable<Array<string>>) {
  const wp = Wp.get_default()!.audio;

  return (
    <Box vertical className="Mixer">
      <Separator />
      <Box vexpand={false} p="2xl" mx="lg">
        <Icon symbolic css="margin-right: .3em" icon={bind(wp.defaultSpeaker, 'icon')} />
        <Slider onDragged={({ value }) => (wp.defaultSpeaker.volume = value)} value={bind(wp.defaultSpeaker, 'volume')} />
      </Box>
      <Separator />
      <Box vertical gap="2xl" py="2xl" px="lg">
        {bind(wp, 'streams').as(ss =>
          ss.length > 0 ? (
            ss.map(s => (
              <box visible={filter(f => f.includes(s.name.toLowerCase()))}>
                <MixerItem stream={s} />
              </box>
            ))
          ) : (
            <box halign={CENTER}>No audio playing</box>
          ),
        )}
      </Box>
      <Separator />
      <Box vertical gap="2xl" py="2xl">
        {bind(wp, 'speakers').as(ss => ss.map(SinkItem))}
      </Box>
    </Box>
  );
}
