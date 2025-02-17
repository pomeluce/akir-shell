import { Variable } from 'astal';
import { App } from 'astal/gtk3';
import Cliphist from 'core/service/cliphist';
import ColorPicker from 'core/service/colorpicker';
import Box from 'gtk/primitive/Box';
import FlatButton from 'gtk/primitive/FlatButton';
import Grid from 'gtk/primitive/Grid';
import Separator from 'gtk/primitive/Separator';
import options from 'options';

export default function ClipBoard(cliphist: Cliphist, history: Variable<string[]>) {
  const { height, maxItems } = options.launcher.clipboard;
  const picker = ColorPicker.get_default(options.bar.colorpicker.maxItems.get());
  const colors = Variable<string[]>(picker.colors.toReversed());

  return (
    <revealer
      revealChild={history(h => h.length > 0)}
      transitionType={SLIDE_DOWN}
      setup={self => {
        self.hook(cliphist, 'notify::history', () => history.set(cliphist.history));
        self.hook(picker, 'notify::colors', () => colors.set(picker.colors));
      }}
      onDestroy={() => {
        history.drop();
        colors.drop();
      }}
    >
      <Box vertical className="CMD" pb="2xl">
        {colors.get().length && (
          <>
            <Separator />
            <Box p="2xl" halign={CENTER}>
              <Grid name="colors" breakpoint={5}>
                {colors(c =>
                  c.toReversed().map(color => (
                    <Box mx="2xl" my="xl">
                      <button
                        canFocus={false}
                        onClicked={() => {
                          picker.wlCopy(color);
                          App.get_window('launcher')!.visible = false;
                        }}
                        css={`
                          * {
                            min-height: ${height.get()}rem;
                            background-color: ${color};
                            color: transparent;
                          }
                          *:hover {
                            color: white;
                            text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.8);
                          }
                        `}
                      >
                        <label label={color} />
                      </button>
                    </Box>
                  )),
                )}
              </Grid>
            </Box>
          </>
        )}
        {history(his =>
          his.slice(0, maxItems.get()).map(h => (
            <box vertical>
              <Separator />
              <FlatButton
                onClicked={() => {
                  cliphist.select(h);
                  App.get_window('launcher')!.visible = false;
                }}
              >
                <Box m="md" px="2xl" css={height(h => `min-height: ${h}rem;`)}>
                  <label wrap xalign={0} label={h} maxWidthChars={58} />
                </Box>
              </FlatButton>
            </box>
          )),
        )}
      </Box>
    </revealer>
  );
}
