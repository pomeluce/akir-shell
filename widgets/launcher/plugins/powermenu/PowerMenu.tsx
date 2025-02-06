import Variable from 'astal/variable';
import Separator from 'gtk/primitive/Separator';
import FlatButton from 'gtk/primitive/FlatButton';
import Box from 'gtk/primitive/Box';
import Icon from 'gtk/primitive/Icon';
import options from '../../options';
import type { Btn } from '.';
import { exec } from 'astal/process';

function PowerButton({ btn, label }: { btn: Btn; label: string }) {
  const clicked = () => exec(options.powermenu[btn].get());
  const icons = {
    sleep: 'weather-clear-night',
    reboot: 'system-reboot',
    logout: 'system-log-out',
    shutdown: 'system-shutdown',
  };

  return (
    <FlatButton color="error" onClicked={clicked}>
      <Box hexpand px="2xl" m="lg">
        <Icon symbolic css="margin-right: .3em" icon={icons[btn]} />
        <label label={label} />
      </Box>
    </FlatButton>
  );
}

export default function PowerMenu(filter: Variable<Array<string>>) {
  const btns: Array<[Btn, string]> = [
    ['shutdown', 'Shutdown'],
    ['logout', 'Log Out'],
    ['reboot', 'Reboot'],
    ['sleep', 'Sleep'],
  ];

  return (
    <Box vertical pb="xl">
      {btns.map(([btn, label]) => (
        <revealer transitionType={SLIDE_DOWN} revealChild={filter(f => f.includes(btn))}>
          <box vertical>
            <Separator />
            <PowerButton btn={btn} label={label} />
          </box>
        </revealer>
      ))}
    </Box>
  );
}
