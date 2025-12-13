import Cliphist from '@/service/cliphist';
import TextButton from './text-button';
import ColorButton from './color-button';
import { Box } from '@/components';
import { Accessor, For, Setter } from 'gnim';
import { configs } from 'options';
import app from 'ags/gtk4/app';
import ImageButton from './image-button';

const colorPatterns = {
  hex: /^#(?:[0-9A-Fa-f]{3}){1,2}$/,
  rgb: /^rgb\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*\)$/,
  rgba: /^rgba\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(?:1|0|0?\.\d+)\s*\)$/,
  hsl: /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3}%)\s*,\s*(\d{1,3}%)\s*\)$/,
  hsla: /^hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3}%)\s*,\s*(\d{1,3}%)\s*,\s*(?:1|0|0?\.\d+)\s*\)$/,
};

const imagePattern = /\[\[ binary data \d+ ([KMGT]i)?B \w+ \d+x\d+ \]\]/;

export default ({ history, setHistory }: { history: Accessor<string[]>; setHistory: Setter<string[]> }) => {
  const { height, maxItems, imagePreview } = configs.launcher.clipboard;

  const cliphist = Cliphist.get_default();

  const isImage = (text: string) => imagePreview.peek() && text.match(imagePattern);
  const isColor = (text: string) =>
    Object.entries(colorPatterns).find(([_, pattern]) => {
      return pattern.test(text.trim());
    });

  const handleClick = (h: string) => {
    cliphist.select(h);
    app.get_window('launcher')!.visible = false;
  };

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
          {(h: string) => {
            const text = h.replace(/^\s*\d+\s+/, '');

            return isColor(text) ? (
              <ColorButton text={text} height={height} onClick={() => handleClick(h)} />
            ) : isImage(text) ? (
              <ImageButton text={h} height={height} onClick={() => handleClick(h)} />
            ) : (
              <TextButton text={text} height={height} onClick={() => handleClick(h)} />
            );
          }}
        </For>
      </Box>
    </revealer>
  );
};
