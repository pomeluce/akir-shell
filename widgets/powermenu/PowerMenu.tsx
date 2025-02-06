import Box from 'gtk/primitive/Box';
import PopupBin from 'gtk/primitive/PopupBin';
import PopupWindow from 'gtk/primitive/PopupWindow';
import PowerButton from './PowerButton';
import options from './options';
import type { Btn } from '.';

type Props = {
  onClick: (btn: Btn) => void;
};

const Hibernate = ({ onClick }: Props) => <PowerButton label="Hibernate" onClick={() => onClick('hibernate')} icon="system-hibernate" />;

const Shutdown = ({ onClick }: Props) => <PowerButton label="Shutdown" onClick={() => onClick('shutdown')} icon="system-shutdown" />;

const LogOut = ({ onClick }: Props) => <PowerButton label="Log Out" onClick={() => onClick('logout')} icon="system-log-out" />;

const Reboot = ({ onClick }: Props) => <PowerButton label="Reboot" onClick={() => onClick('reboot')} icon="system-reboot" />;

const Sleep = ({ onClick }: Props) => <PowerButton label="Sleep" onClick={() => onClick('sleep')} icon="weather-clear-night" />;

const LockScreen = ({ onClick }: Props) => <PowerButton label="Lock Screen" onClick={() => onClick('lockscreen')} icon="system-lock-screen" />;

const LineLayout = ({ onClick }: Props) => (
  <Box gap="2xl">
    <Hibernate onClick={onClick} />
    <Shutdown onClick={onClick} />
    <LogOut onClick={onClick} />
    <Reboot onClick={onClick} />
    <Sleep onClick={onClick} />
    <LockScreen onClick={onClick} />
  </Box>
);

const BoxLayout = ({ onClick }: Props) => (
  <Box vertical>
    <Box gap="2xl">
      <Hibernate onClick={onClick} />
      <Shutdown onClick={onClick} />
      <LogOut onClick={onClick} />
    </Box>
    <Box gap="2xl">
      <Reboot onClick={onClick} />
      <Sleep onClick={onClick} />
      <LockScreen onClick={onClick} />
    </Box>
  </Box>
);

export default function PowerMenu({ onClick }: Props) {
  return (
    <PopupWindow shade name="powermenu">
      <PopupBin valign={CENTER} vexpand={false} r="4xl" p="2xl">
        <Box m="2xl" p="lg">
          {options.layout(l => (l === '1x6' ? <LineLayout onClick={onClick} /> : <BoxLayout onClick={onClick} />))}
        </Box>
      </PopupBin>
    </PopupWindow>
  );
}
