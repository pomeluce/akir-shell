import Pango from 'gi://Pango?version=1.0';
import Cliphist from '@/service/cliphist';
import { Gtk } from 'ags/gtk4';
import { Box, FlatButton, Separator } from '@/components';
import { Accessor, For, Setter } from 'gnim';
import { configs } from 'options';
import app from 'ags/gtk4/app';

export default ({ cliphist, history, setHistory }: { cliphist: Cliphist; history: Accessor<string[]>; setHistory: Setter<string[]> }) => {
  const { height, maxItems } = configs.launcher.clipboard;

  return (
    <revealer
      revealChild={history(h => h.length > 0)}
      transitionType={SLIDE_DOWN}
      $={() => {
        cliphist.connect('notify::history', () => setHistory(cliphist.history));
      }}
    >
      <Box vertical pb="2xl">
        <For each={history(his => his.slice(0, maxItems.peek()))}>
          {(h: string) => (
            <box orientation={Gtk.Orientation.VERTICAL}>
              <Separator />
              <FlatButton
                onClicked={() => {
                  cliphist.select(h);
                  app.get_window('launcher')!.visible = false;
                }}
              >
                <Box m="md" px="2xl" css={height(h => `min-height: ${h}rem;`)}>
                  <label xalign={0} label={h} maxWidthChars={58} singleLineMode ellipsize={Pango.EllipsizeMode.END} />
                </Box>
              </FlatButton>
            </box>
          )}
        </For>
      </Box>
    </revealer>
  );
};
