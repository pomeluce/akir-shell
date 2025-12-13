import Pango from 'gi://Pango?version=1.0';
import { Box, FlatButton, Separator } from '@/components';
import { Gdk, Gtk } from 'ags/gtk4';
import { Accessor } from 'gnim';

export default ({ text, height, onClick }: { text: string; height: Accessor<number>; onClick: () => void }) => {
  const gdkColor = new Gdk.RGBA();
  const isValid = gdkColor.parse(text);

  return (
    <box orientation={Gtk.Orientation.VERTICAL}>
      <Separator />
      <FlatButton onClicked={onClick}>
        <Box m="md" px="2xl" spacing={16} css={height(h => `min-height: ${h}rem;`)}>
          <box
            widthRequest={20}
            heightRequest={20}
            valign={Gtk.Align.CENTER}
            class="color"
            css={`
              background: ${isValid ? text : 'transparent'};
            `}
          />
          <label xalign={0} label={text} maxWidthChars={58} singleLineMode ellipsize={Pango.EllipsizeMode.END} />
        </Box>
      </FlatButton>
    </box>
  );
};
