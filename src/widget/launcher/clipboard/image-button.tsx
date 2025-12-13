import Cliphist from '@/service/cliphist';
import { Box, FlatButton, Separator } from '@/components';
import { Gtk } from 'ags/gtk4';
import { Accessor } from 'gnim';
import GdkPixbuf from 'gi://GdkPixbuf?version=2.0';

export default ({ text, height, onClick }: { text: string; height: Accessor<number>; onClick: () => void }) => {
  const cliphist = Cliphist.get_default();
  const id = text.split('\t')[0];

  return (
    <box orientation={Gtk.Orientation.VERTICAL}>
      <Separator />
      <FlatButton onClicked={onClick}>
        <Box px="2xl" css={height(h => `min-height: ${h}rem;`)}>
          <Gtk.Image
            class="image"
            halign={CENTER}
            valign={CENTER}
            pixelSize={400}
            $={async self => {
              const image = await cliphist.load_image(id);
              if (!image) return;
              const pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_scale(image, 1920, 1080, true);
              self.set_from_pixbuf(pixbuf);
            }}
          />
        </Box>
      </FlatButton>
    </box>
  );
};
