import { App } from 'astal/gtk3';
import { execAsync } from 'astal/process';
import Variable from 'astal/variable';
import Separator from 'gtk/primitive/Separator';
import Box from 'gtk/primitive/Box';
import FlatButton from 'gtk/primitive/FlatButton';
import options from 'options';

export default function CMD(bins: Variable<Array<string>>) {
  const { height } = options.launcher.cmd;
  return (
    <revealer revealChild={bins(b => b.length > 0)} transitionType={SLIDE_DOWN}>
      <Box vertical className="CMD" pb="2xl">
        {bins(bins =>
          bins.map(bin => (
            <box vertical>
              <Separator />
              <FlatButton
                onClicked={() => {
                  execAsync(bin).catch(console.error);
                  App.get_window('launcher')!.visible = false;
                }}
              >
                <Box m="md" px="2xl" css={height(h => `min-height: ${h}rem;`)}>
                  <label wrap xalign={0} label={bin} />
                </Box>
              </FlatButton>
            </box>
          )),
        )}
      </Box>
    </revealer>
  );
}
