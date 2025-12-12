import Mpris from 'gi://AstalMpris?version=0.1';
import Pango from 'gi://Pango?version=1.0';
import { Gtk } from 'ags/gtk4';
import { Box, Button, Icon, Slider } from '@/components';
import { Accessor, createBinding, createComputed, For } from 'gnim';
import { scss } from '@/theme/style';
import { fake, lengthStr } from '@/support/utils';
import { throttle } from '@/support/function';
import { configs } from 'options';

void scss`.media-player {
  .cover-art {
    background-size: cover;
    background-position: center;
    box-shadow: none;
  }

  label.title {
    color: $fg;
    font-weight: bold;
  }

  label.description {
    color: transparentize($fg, .2);
  }
}`;

type MediaProps = {
  player: Mpris.Player;
  maxChars?: Accessor<number> | number;
  coverSize?: Accessor<number> | number;
  monochromeIcon?: Accessor<boolean> | boolean;
};

const { quicksettings } = configs;

const MediaPlayer = ({ player, maxChars = 30, coverSize = 6 }: MediaProps) => {
  const { icon } = quicksettings.media;

  const coverArt = createComputed(() => {
    const s = fake(coverSize);
    const url = createBinding(player, 'coverArt');
    return `
      min-width: ${s()}rem;
      min-height: ${s()}rem;
      background-image: url('file://${url()}');
    `;
  });

  const cover = (
    <Box hexpand={false} r="lg" valign={CENTER} class="cover-art" css={coverArt}>
      <Icon
        symbolic
        hexpand
        css={fake(coverSize).as(s => `font-size: ${s * 0.7}rem;`)}
        halign={CENTER}
        iconName="audio-x-generic"
        visible={createBinding(player, 'coverArt').as(c => !c)}
      />
    </Box>
  );

  const title = (
    <label
      hexpand
      xalign={0}
      halign={START}
      class="title"
      maxWidthChars={maxChars}
      ellipsize={Pango.EllipsizeMode.END}
      singleLineMode
      label={createBinding(player, 'title').as(t => t || '')}
    />
  );

  const artist = (
    <label
      hexpand
      xalign={0}
      halign={START}
      class="artist"
      maxWidthChars={maxChars}
      ellipsize={Pango.EllipsizeMode.END}
      singleLineMode
      label={createBinding(player, 'artist').as(a => a || '')}
    />
  );

  const positionSlider = (
    <Slider
      size="sm"
      color="regular"
      valign={CENTER}
      vexpand={false}
      visible={createBinding(player, 'length').as(l => l > 0)}
      onChangeValue={throttle(100, ({ value }) => (player.position = value * player.length))}
      value={createBinding(player, 'position').as(p => (player.length > 0 ? p / player.length : 0))}
    />
  );

  const positionLabel = (
    <label class="position" hexpand halign={START} visible={createBinding(player, 'length').as(l => l > 0)} label={createBinding(player, 'position').as(lengthStr)} />
  );

  const lengthLabel = (
    <label
      class="length"
      hexpand
      halign={END}
      visible={createBinding(player, 'length').as(l => l > 0)}
      label={createBinding(player, 'length').as(l => (l > 0 ? lengthStr(l) : '0:00'))}
    />
  );

  const playerIcon = (
    <Icon symbolic={icon.monochrome()} size={icon.size()} iconName={createBinding(player, 'entry')} fallback="audio-x-generic" tooltipText={createBinding(player, 'identity')} />
  );

  const playPause = (
    <Button flat px="sm" class="play-pause" visible={createBinding(player, 'canPlay')} onClicked={() => player.play_pause()}>
      <Box p="md">
        <Icon
          iconName={createBinding(player, 'playbackStatus').as(s => {
            switch (s) {
              case Mpris.PlaybackStatus.PLAYING:
                return 'media-playback-pause';
              default:
                return 'media-playback-start';
            }
          })}
        />
      </Box>
    </Button>
  );

  const prev = (
    <Button flat px="sm" onClicked={() => player.previous()} visible={createBinding(player, 'canGoPrevious')}>
      <Box p="md">
        <Icon symbolic iconName="media-skip-backward" />
      </Box>
    </Button>
  );

  const next = (
    <Button flat px="sm" onClicked={() => player.next()} visible={createBinding(player, 'canGoNext')}>
      <Box p="md">
        <Icon symbolic iconName="media-skip-forward" />
      </Box>
    </Button>
  );

  return (
    <Box vexpand={false} class="media-player" r="2xl">
      {cover}
      <Box py="sm" px="2xl" vertical css="padding-right: 0;">
        <box>
          {title}
          {playerIcon}
        </box>
        {artist}
        <box valign={END} vexpand orientation={Gtk.Orientation.VERTICAL}>
          <Box py="md">{positionSlider}</Box>
          <box>
            {positionLabel}
            <box>
              {prev}
              {playPause}
              {next}
            </box>
            {lengthLabel}
          </box>
        </box>
      </Box>
    </Box>
  );
};

export const Media = () => {
  const players = createBinding(Mpris.get_default(), 'players');
  const { coverSize, maxItems } = quicksettings.media;

  return (
    <Box vertical gap="2xl">
      <For each={players.as(ps => ps.slice(0, maxItems.get()))}>
        {(p: Mpris.Player) => (
          <Box vertical class="raised" p="2xl" r="2xl">
            <MediaPlayer coverSize={coverSize()} player={p} />
          </Box>
        )}
      </For>
    </Box>
  );
};
