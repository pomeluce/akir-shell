import { derive } from 'astal';
import { Astal } from 'astal/gtk3';
import Box from 'gtk/primitive/Box';
import PopupBin from 'gtk/primitive/PopupBin';
import PopupWindow from 'gtk/primitive/PopupWindow';
import options from 'options';
import Notifications from './notification/Notifications';
import { scss } from 'core/theme';
import DateTime from './date/DateTime';

void scss`.DateMenu {
  .clock-box {
    .clock {
      font-size: 5em;
    }
    .uptime {
      color: transparentize($fg, 0.2);
    }
 }
}`;

const { bar, datemenu } = options;

const layout = derive([bar.position, datemenu.position], (bar, qs) => `${bar}_${qs}` as const);

export default function DateMenu() {
  return (
    <PopupWindow name="datemenu" position={layout()} exclusivity={Astal.Exclusivity.EXCLUSIVE}>
      <PopupBin r="md">
        <Box className="DateMenu" p="2xl">
          <Notifications />
          <DateTime />
        </Box>
      </PopupBin>
    </PopupWindow>
  );
}
