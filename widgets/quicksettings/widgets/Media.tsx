import { Binding, Variable, bind } from 'astal';
import Box from 'gtk/primitive/Box';
import Button from 'gtk/primitive/Button';
import Icon from 'gtk/primitive/Icon';
import Slider from 'gtk/primitive/Slider';
import Mpris from 'gi://AstalMpris';
import { throttle } from 'core/lib/function';
import { lengthStr, fake } from 'core/lib/utils';
import { scss } from 'core/theme';
import options from 'options';

void scss`.MediaPlayer {
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
  maxChars?: Binding<number> | number;
  coverSize?: Binding<number> | number;
  monochromeIcon?: Binding<boolean> | boolean;
};

const { quicksettings } = options;

const MediaPlayer = ({ player, maxChars = 30, coverSize = 6 }: MediaProps) => {
  const { icon } = quicksettings.media;

  const coverArt = Variable.derive(
    [fake(coverSize), bind(player, 'coverArt')],
    (s, url) => `
      min-width: ${s}rem;
      min-height: ${s}rem;
      background-image: url('${url}');
    `,
  );

  const cover = (
    <Box hexpand={false} r="lg" valign={CENTER} className="cover-art" css={coverArt()}>
      <Icon symbolic hexpand css={fake(coverSize).as(s => `font-size: ${s * 0.7}rem`)} halign={CENTER} icon="audio-x-generic" visible={bind(player, 'coverArt').as(c => !c)} />
    </Box>
  );

  const title = <label hexpand xalign={0} halign={START} className="title" maxWidthChars={maxChars} truncate label={bind(player, 'title').as(t => t || '')} />;

  const artist = <label hexpand xalign={0} halign={START} className="artist" maxWidthChars={maxChars} truncate label={bind(player, 'artist').as(a => a || '')} />;

  const positionSlider = (
    <Slider
      size="sm"
      color="regular"
      valign={CENTER}
      vexpand={false}
      visible={bind(player, 'length').as(l => l > 0)}
      onDragged={throttle(100, ({ value }) => (player.position = value * player.length))}
      value={bind(player, 'position').as(p => (player.length > 0 ? p / player.length : 0))}
    />
  );

  const positionLabel = <label className="position" hexpand halign={START} visible={bind(player, 'length').as(l => l > 0)} label={bind(player, 'position').as(lengthStr)} />;

  const lengthLabel = (
    <label className="length" hexpand halign={END} visible={bind(player, 'length').as(l => l > 0)} label={bind(player, 'length').as(l => (l > 0 ? lengthStr(l) : '0:00'))} />
  );

  const playerIcon = <Icon symbolic={icon.monochrome()} size={icon.size()} icon={bind(player, 'entry')} fallback="audio-x-generic" tooltipText={bind(player, 'identity')} />;

  const playPause = (
    <Button flat mx="sm" className="play-pause" visible={bind(player, 'canPlay')} onClicked={() => player.play_pause()}>
      <Box p="md">
        <Icon
          icon={bind(player, 'playbackStatus').as(s => {
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
    <Button flat mx="sm" onClicked={() => player.previous()} visible={bind(player, 'canGoPrevious')}>
      <Box p="md">
        <Icon symbolic icon="media-skip-backward" />
      </Box>
    </Button>
  );

  const next = (
    <Button flat mx="sm" onClicked={() => player.next()} visible={bind(player, 'canGoNext')}>
      <Box p="md">
        <Icon symbolic icon="media-skip-forward" />
      </Box>
    </Button>
  );

  return (
    <Box vexpand={false} className="MediaPlayer" r="2xl">
      {cover}
      <Box py="sm" px="2xl" vertical css="padding-right: 0">
        <box>
          {title}
          {playerIcon}
        </box>
        {artist}
        <box valign={END} vexpand vertical>
          <Box py="md">{positionSlider}</Box>
          <centerbox>
            {positionLabel}
            <box>
              {prev}
              {playPause}
              {next}
            </box>
            {lengthLabel}
          </centerbox>
        </box>
      </Box>
    </Box>
  );
};

export const Media = () => {
  const players = bind(Mpris.get_default(), 'players');
  const { coverSize, maxItems } = quicksettings.media;

  return (
    <Box vertical gap="2xl">
      {players.as(ps =>
        ps.slice(0, maxItems.get()).map(p => (
          <Box vertical className="raised" p="2xl" r="2xl">
            <MediaPlayer coverSize={coverSize()} player={p} />
          </Box>
        )),
      )}
    </Box>
  );
};
