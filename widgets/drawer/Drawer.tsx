import { Gtk } from 'astal/gtk3';
import { bind, Variable } from 'astal';
import Apps from 'gi://AstalApps';
import PopupWindow from 'gtk/primitive/PopupWindow';
import Grid from 'gtk/primitive/Grid';
import Button from 'gtk/primitive/Button';
import Box from 'gtk/primitive/Box';
import AppButton from './AppButton';
import { chunks } from 'core/lib/array';
import { scss } from 'core/theme';
import options from 'options';

void scss`window#drawer {
  &.solid {
    background-color: $bg;
  }

  .app-grid {
    padding: 0 28rem;
  }

  .Pager .Button {
    min-width: 2rem;
    min-width: 2rem;

    label {
      font-size: 0px;
    }

    .Box {
      transition: $transition;
      border-radius: $radius;
      background-color: $fg;
      min-width: .4rem;
      min-height: .4rem;
    }

    &.selected .Box {
      min-width: .6rem;
      min-height: .6rem;
      background-color: $primary;
    }
  }
}`;

export default function Drawer() {
  const apps = bind(new Apps.Apps(), 'list');
  const rows = options.drawer.rows();
  const size = options.drawer.rowSize();
  const solid = options.drawer.solidBackground();

  const grids = Variable.derive([apps, rows, size], (apps, rows, size) => chunks(size * rows, apps));

  const visible = Variable(0);

  return (
    <PopupWindow shade name="drawer" className={solid.as(s => (s ? 'solid' : ''))}>
      <box className="app-grid" vertical>
        <stack shown={visible(String)} transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}>
          {grids(grids =>
            grids.map((grid, i) => (
              <Grid name={String(i)} breakpoint={size}>
                {grid.map(app => (
                  <AppButton app={app} />
                ))}
              </Grid>
            )),
          )}
        </stack>
        <Box hexpand>
          <Box className="Pager" halign={CENTER} hexpand>
            {grids(grids =>
              grids.length == 1
                ? []
                : grids.map((_, i) => (
                    <Button flat m="md" className={visible(v => (v == i ? 'selected' : ''))} onClicked={() => visible.set(i)}>
                      <Box m="xl" halign={CENTER} valign={CENTER}>
                        {String(i)}
                      </Box>
                    </Button>
                  )),
            )}
          </Box>
        </Box>
      </box>
    </PopupWindow>
  );
}
