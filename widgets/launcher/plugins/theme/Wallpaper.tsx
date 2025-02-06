import { Widget, App } from 'astal/gtk3';
import { Variable, GLib, Binding, idle } from 'astal';
import Box from 'gtk/primitive/Box';
import Separator from 'gtk/primitive/Separator';
import { thumbnail } from 'gtk/utils';
import { cnames } from 'core/lib/utils';
import { chunks } from 'core/lib/array';
import { scss } from 'core/theme';
import { setWallpaper } from 'core/theme/integrations/swww';
import AccentPicker from './AccentPicker';
import options from '../../options';

void scss`.Launcher .WallpaperButton {
    all: unset;
    transition: $transition;
    background-size: cover;
    background-position: center;
    border-radius: $radius;

    @if $shadows {
        box-shadow: 0 0 4pt 0 $shadow-color, inset 0 0 0 $border-width $border-color;
    }

    &.highlight {
        @if $shadows {
            box-shadow: 0 0 4pt 0 $shadow-color, inset 0 0 0 $border-width $success;
        } @else {
            box-shadow: inset 0 0 0 $border-width $success;
        }
    }

    &:focus,
    &:hover {
        @if $shadows {
            box-shadow: 0 0 4pt 0 $shadow-color, inset 0 0 0 $border-width $primary;
        } @else {
            box-shadow: inset 0 0 0 $border-width $primary;
        }
    }
}`;

function WallpaperItem({ file, highlight }: { file: string; highlight: Binding<boolean> }) {
  const { height } = options.theme.wallpapers;
  let btn: Widget.Button;

  idle(() =>
    thumbnail(file)
      .then(thumbnail => {
        btn.css = `background-image: url('${thumbnail}');`;
      })
      .catch(err => {
        printerr(err, file);
      }),
  );

  return (
    <Box m="md">
      <button
        hexpand
        tooltipText={GLib.path_get_basename(file)}
        setup={self => (btn = self)}
        className={highlight.as(h => cnames('WallpaperButton', h && 'highlight'))}
        onClicked={() => {
          setWallpaper(file);
          App.get_window('launcher')!.visible = false;
        }}
      >
        <box css={height(h => `min-height: ${h}pt`)} />
      </button>
    </Box>
  );
}

type Props = {
  wallpapers: Array<string>;
  filter: Variable<Array<string>>;
};

export default function Wallpaper({ wallpapers, filter }: Props) {
  const { columns } = options.theme.wallpapers;

  return (
    <Box vertical pb="2xl">
      <Separator mb="md" />
      <AccentPicker />
      <Separator m="md" />
      <Box px="2xl" vertical>
        {columns(c =>
          chunks(c, wallpapers)
            .filter(row => row.length === columns.get())
            .map(row => (
              <box homogeneous>
                {row.map(w => (
                  <WallpaperItem file={w} highlight={filter(f => f.includes(w))} />
                ))}
              </box>
            )),
        )}
      </Box>
    </Box>
  );
}
