import Apps from 'gi://AstalApps?version=0.1';
import { Box, Separator } from '@/components';
import { Gtk } from 'ags/gtk4';
import { AppButton } from './app-button';
import { Accessor, createComputed, For } from 'gnim';
import { scss } from '@/theme/style';

export default ({ list, visible }: { list: Accessor<Array<Apps.Application>>; visible: Accessor<string[]> }) => {
  const nonempty = createComputed(() => list().filter(app => visible().includes(app.entry)).length > 0);
  return (
    <revealer transitionType={SLIDE_DOWN} revealChild={nonempty}>
      <Box class="application-list" vertical pb="2xl">
        <For each={list}>
          {app => (
            <revealer transitionType={SLIDE_DOWN} revealChild={visible.as(list => list.includes(app.entry))}>
              <box orientation={Gtk.Orientation.VERTICAL}>
                <Separator my="md" />
                <Box px="2xl">
                  <AppButton app={app} />
                </Box>
              </box>
            </revealer>
          )}
        </For>
      </Box>
    </revealer>
  );
};

void scss`.launcher .application-list {
  margin-top: -$spacing * .4;
}`;
