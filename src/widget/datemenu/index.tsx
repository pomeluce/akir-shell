import DateTime from './date-time';
import Notifications from './notifications';
import { Astal } from 'ags/gtk4';
import { Box, PopupBin, PopupWindow } from '@/components';
import { scss } from '@/theme/style';
import { createComputed, createRoot } from 'gnim';
import { configs } from 'options';

const { position } = configs.datemenu;
const { anchor } = configs.bar;

const layout = createComputed(() => `${anchor()}_${position()}` as const);

export default () =>
  createRoot(() => {
    return (
      <PopupWindow name="datemenu" namespace="akir-datemenu" position={layout()} exclusivity={Astal.Exclusivity.EXCLUSIVE}>
        <PopupBin r="md">
          <Box class="date-menu" p="2xl">
            <Notifications />
            <DateTime />
          </Box>
        </PopupBin>
      </PopupWindow>
    );
  });

void scss`.date-menu {
  .clock-box {
    .clock {
      font-size: 5em;
    }
    .uptime {
      color: transparentize($fg, 0.2);
    }
 }
}`;
