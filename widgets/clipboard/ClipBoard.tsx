import Box from 'gtk/primitive/Box';
import PopupBin from 'gtk/primitive/PopupBin';
import PopupWindow from 'gtk/primitive/PopupWindow';

export default function ClipBoard() {
  return (
    <PopupWindow name="clipboard" position="top_center">
      <PopupBin r="md">
        <Box p="2xl">aaa</Box>
      </PopupBin>
    </PopupWindow>
  );
}
