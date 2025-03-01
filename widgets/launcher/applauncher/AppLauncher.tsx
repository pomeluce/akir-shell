import Apps from 'gi://AstalApps';
import { Binding, Variable } from 'astal';
import Box from 'gtk/primitive/Box';
import AppButton from './AppButton';
import Separator from 'gtk/primitive/Separator';
import { scss } from 'core/theme';

void scss`.Launcher .ApplicationList {
  margin-top: -$spacing * .4;
}`;

type Props = { list: Binding<Array<Apps.Application>>; visible: Binding<Array<string>> };

export default function AppLauncher({ list, visible }: Props) {
  const nonempty = Variable.derive([list, visible], (l, v) => l.filter(app => v.includes(app.entry!)).length > 0);

  return (
    <revealer transitionType={SLIDE_DOWN} revealChild={nonempty()}>
      <Box className="ApplicationList" vertical pb="2xl">
        {list.as(apps =>
          apps.map(app => (
            <revealer transitionType={SLIDE_DOWN} revealChild={visible.as(list => list.includes(app.entry!))}>
              <box vertical>
                <Separator my="md" />
                <Box px="2xl">
                  <AppButton app={app} />
                </Box>
              </box>
            </revealer>
          )),
        )}
      </Box>
    </revealer>
  );
}
