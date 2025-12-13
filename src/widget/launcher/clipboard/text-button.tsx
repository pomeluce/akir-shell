import Pango from 'gi://Pango?version=1.0';
import { Box, FlatButton, Separator } from '@/components';
import { Gtk } from 'ags/gtk4';
import { Accessor } from 'gnim';

export default ({ text, height, onClick }: { text: string; height: Accessor<number>; onClick: () => void }) => {
  return (
    <box orientation={Gtk.Orientation.VERTICAL}>
      <Separator />
      <FlatButton onClicked={onClick}>
        <Box m="md" px="2xl" css={height(h => `min-height: ${h}rem;`)}>
          <label xalign={0} label={text} maxWidthChars={58} singleLineMode ellipsize={Pango.EllipsizeMode.END} />
        </Box>
      </FlatButton>
    </box>
  );
};
