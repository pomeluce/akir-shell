import { App } from 'astal/gtk3';
import { execAsync } from 'astal/process';
import Variable from 'astal/variable';
import Separator from 'gtk/primitive/Separator';
import Box from 'gtk/primitive/Box';
import FlatButton from 'gtk/primitive/FlatButton';

export default function Sh(bins: Variable<Array<string>>) {
  return (
    <revealer revealChild={bins(b => b.length > 0)} transitionType={SLIDE_DOWN}>
      <Box vertical className="Sh" pb="2xl">
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
                <Box m="md" px="2xl">
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
