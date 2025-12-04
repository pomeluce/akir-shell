import { Box, Button, PopupBin, PopupWindow } from '@/components';
import { Accessor, createRoot } from 'gnim';
import { scss } from '@/theme/theme';
import app from 'ags/gtk4/app';

void scss`akirds-popup#verification {
  label.action {
    font-size: 1.4em;
    font-weight: bold;
    color: $fg;
  }

  label.confirm {
    font-weight: normal;
    color: transparentize($fg, 0.1)
  }
}`;

type Props = {
  label: Accessor<string>;
  onAccept: () => void;
};

export default ({ label, onAccept }: Props) =>
  createRoot(() => {
    const hide = () => (app.get_window('verification')!.visible = false);

    return (
      <PopupWindow shade name="verification">
        <PopupBin p="2xl" r="lg">
          <Box vertical gap="2xl" m="2xl">
            <Box vertical m="md">
              <label class="action" label={label} />
              <label class="confirm" label="Are you sure?" />
            </Box>
            <Box gap="xl" m="lg" css="min-width: 16rem;">
              <Button hfill onClicked={hide} p="md">
                <Box hexpand p="xl" halign={CENTER}>
                  No
                </Box>
              </Button>
              <Button hfill onClicked={onAccept} p="md" suggested color="error">
                <Box hexpand p="xl" halign={CENTER}>
                  Yes
                </Box>
              </Button>
            </Box>
          </Box>
        </PopupBin>
      </PopupWindow>
    );
  });
