import { Variable, bind } from 'astal';
import Mpris from 'gi://AstalMpris';
import MediaPlayer from './MediaPlayer';
import Separator from 'gtk/primitive/Separator';
import Box from 'gtk/primitive/Box';
import { scss } from 'core/theme';
import options from '../../options';
import Icon from 'gtk/primitive/Icon';

void scss`.Launcher .Media {
  .NonPlaying icon {
      color: $error;
  }

  .List {
      /* md Separator spacing */
      margin-top: -$spacing * .4;
  }
}`;

export default function Media(filter: Variable<string>) {
  const players = bind(Mpris.get_default(), 'players');
  const { coverSize } = options.music;

  return (
    <Box vertical className="Media" pb="2xl">
      <Box vertical className="NonPlaying" visible={players.as(ps => ps.length === 0)}>
        <Separator />
        <Box pt="2xl" halign={CENTER}>
          <Icon symbolic css="margin-right: .1em" icon="emblem-music" />
          There is no media playing.
        </Box>
      </Box>
      <Box vertical className="List">
        {players.as(ps =>
          ps.map(p => (
            <revealer
              transitionType={SLIDE_DOWN}
              revealChild={filter(f => {
                const filter = f.toLowerCase();
                const entry = p.entry?.toLowerCase() ?? '';
                const id = p.identity?.toLowerCase() ?? '';
                return entry.includes(filter) || id.includes(filter);
              })}
            >
              <box vertical>
                <Separator my="md" />
                <Box px="2xl">
                  <MediaPlayer coverSize={coverSize()} player={p} />
                </Box>
              </box>
            </revealer>
          )),
        )}
      </Box>
    </Box>
  );
}
