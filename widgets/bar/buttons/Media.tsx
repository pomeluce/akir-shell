import Icon from 'gtk/primitive/Icon';
import Box from 'gtk/primitive/Box';
import Mpris from 'gi://AstalMpris';
import PanelButton from '../PanelButton';
import { bind, Variable, timeout } from 'astal';
import { throttle } from 'core/lib/function';
import options from 'options';

const { flat, preferred, monochrome, direction, format, maxChars, timeout: tout } = options.bar.media;

function Player(player: Mpris.Player, reveal: Variable<boolean>) {
  let cancel = false;
  const label = Variable.derive([format, bind(player, 'metadata')], f =>
    f.replace('{title}', player.title!).replace('{artist}', player.artist!).replace('{album}', player.album!).replace('{identity}', player.identity!),
  );

  const Revealer = ({ child }: { child?: JSX.Element }) => (
    <revealer
      setup={self =>
        self.hook(player, 'notify::title', () => {
          const time = tout.get();

          if (time > 0) {
            self.revealChild = true;
            timeout(time, () => {
              if (!reveal.get() && !cancel) self.revealChild = false;
            });
          }
        })
      }
      revealChild={reveal()}
      transitionType={direction(d => (d === 'left' ? SLIDE_LEFT : SLIDE_RIGHT))}
    >
      {child}
    </revealer>
  );

  return (
    <box
      onDestroy={() => {
        label.drop();
        cancel = true;
      }}
    >
      <box visible={direction(d => d == 'left')}>
        <Revealer>
          <Box mx="md" css="margin-left: 0">
            <label label={label()} maxWidthChars={maxChars()} truncate />
          </Box>
        </Revealer>
        <Icon symbolic={monochrome()} icon={bind(player, 'entry')} fallback="audio-x-generic" />
      </box>
      <box visible={direction(d => d == 'right')}>
        <Icon symbolic={monochrome()} icon={bind(player, 'entry')} fallback="audio-x-generic" />
        <Revealer>
          <Box mx="md" css="margin-right: 0">
            <label label={label()} maxWidthChars={maxChars()} truncate />
          </Box>
        </Revealer>
      </box>
    </box>
  );
}

export default function () {
  const mpris = Mpris.get_default();
  const reveal = Variable(false);

  const player = Variable.derive([bind(mpris, 'players'), preferred], (ps, pref) => ps.find(p => p.busName?.includes(pref)) || ps?.[0] || null);

  return (
    <PanelButton
      flat={flat()}
      onDestroy={() => player.drop()}
      onClicked={() => player.get()?.play_pause()}
      onHoverLost={throttle(100, () => reveal.set(false))}
      onHover={throttle(100, () => reveal.set(true))}
      visible={player(Boolean)}
    >
      {player(p => p && Player(p, reveal))}
    </PanelButton>
  );
}
