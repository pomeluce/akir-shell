import Pango from 'gi://Pango?version=1.0';
import AstalMpris from 'gi://AstalMpris?version=0.1';
import PanelButton from './panel-button';
import { Gtk } from 'ags/gtk4';
import { Box, Icon } from '@/components';
import { Accessor, createBinding, createComputed, createState, With } from 'gnim';
import { timeout } from 'ags/time';
import { throttle } from '@/support/function';
import options from 'options';

const { flat, preferred, monochrome, direction, format, maxChars, timeout: tout } = options.bar.media;

const Player = (player: AstalMpris.Player, reveal: Accessor<boolean>) => {
  let cancel = false;
  const label = createComputed([format(), createBinding(player, 'metadata')], f =>
    f.replace('{title}', player.title).replace('{artist}', player.artist).replace('{album}', player.album).replace('{identity}', player.identity),
  );

  const Revealer = ({ children }: { children?: JSX.Element }) => (
    <revealer
      $={self =>
        player.connect('notify::title', () => {
          const time = tout.get();

          if (time > 0) {
            self.revealChild = true;
            timeout(time, () => {
              if (!reveal.get() && !cancel) self.revealChild = false;
            });
          }
        })
      }
      revealChild={reveal}
      transitionType={direction()(d => (d === 'left' ? SLIDE_LEFT : SLIDE_RIGHT))}
    >
      {children}
    </revealer>
  );

  return (
    <box>
      <box visible={direction()(d => d == 'left')}>
        <Revealer>
          <Box mx="md" css="margin-left: 0;">
            <label label={label} ellipsize={Pango.EllipsizeMode.END} singleLineMode maxWidthChars={maxChars()} />
          </Box>
        </Revealer>
        <Icon symbolic={monochrome()} iconName={createBinding(player, 'entry')} fallback="audio-x-generic" />
      </box>
      <box visible={direction()(d => d == 'right')}>
        <Icon symbolic={monochrome()} iconName={createBinding(player, 'entry')} fallback="audio-x-generic" />
        <Revealer>
          <Box mx="md" css="margin-right: 0;">
            <label label={label} ellipsize={Pango.EllipsizeMode.END} singleLineMode maxWidthChars={maxChars()} />
          </Box>
        </Revealer>
      </box>
    </box>
  );
};

export default () => {
  const mpris = AstalMpris.get_default();
  const [reveal, setReveal] = createState(false);

  const player = createComputed([createBinding(mpris, 'players'), preferred()], (ps, pref) => ps.find(p => p.busName?.includes(pref)) || ps?.[0] || null);
  const handleMotion = (motion: boolean) => throttle(100, () => setReveal(motion));

  return (
    <PanelButton
      visible={player(Boolean)}
      flat={flat()}
      onClicked={() => player.get().play_pause()}
      $={self => {
        const ctrl = new Gtk.EventControllerMotion();
        ctrl.connect('enter', handleMotion(true));
        ctrl.connect('leave', handleMotion(false));
        self.add_controller(ctrl);
      }}
    >
      <With value={player}>{p => p && Player(p, reveal)}</With>
    </PanelButton>
  );
};
