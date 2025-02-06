import Box from 'gtk/primitive/Box';
import PopupWindow from 'gtk/primitive/PopupWindow';
import PopupBin from 'gtk/primitive/PopupBin';
import Button from 'gtk/primitive/Button';
import App from 'astal/gtk3/app';
import Variable from 'astal/variable';
import { scss } from 'core/theme';

void scss`PopupWindow#verification {
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
  label: Variable<string>;
  onAccept: () => void;
};

export default function Verification({ label, onAccept }: Props) {
  const hide = () => (App.get_window('verification')!.visible = false);

  return (
    <PopupWindow shade name="verification">
      <PopupBin p="2xl" r="lg">
        <Box vertical gap="2xl" m="md">
          <Box vertical m="md">
            <label className="action" label={label()} />
            <label className="confirm" label="Are you sure?" />
          </Box>
          <Box gap="xl" m="lg" css="min-width: 16rem">
            <Button hfill onClicked={hide} m="md">
              <Box hexpand p="xl" halign={CENTER}>
                No
              </Box>
            </Button>
            <Button hfill onClicked={onAccept} m="md" suggested color="error">
              <Box hexpand p="xl" halign={CENTER}>
                Yes
              </Box>
            </Button>
          </Box>
        </Box>
      </PopupBin>
    </PopupWindow>
  );
}
