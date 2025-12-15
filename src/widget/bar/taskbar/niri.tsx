import AstalNiri from 'gi://AstalNiri?version=0.1';
import PanelButton from '../panel-button';
import { Icon } from '@/components';
import { createBinding, For } from 'gnim';
import { compositor, configs } from 'options';

const niri = compositor() === 'niri' ? AstalNiri.get_default() : null;

function Client(client: AstalNiri.Window) {
  const { flat, monochrome } = configs.bar.taskbar;
  const niri = AstalNiri.get_default();

  const focused = createBinding(niri, 'focusedWindow').as(c => c === client);

  return (
    <PanelButton
      flat={flat()}
      suggested={focused}
      color={focused.as(f => (f ? 'primary' : 'regular'))}
      tooltipText={createBinding(client, 'title')}
      onClicked={() => client.focus(client.id)}
    >
      <Icon class={focused.as(f => (f ? 'focused' : ''))} fallback="application-x-executable" symbolic={monochrome()} iconName={createBinding(client, 'app_id')} />
    </PanelButton>
  );
}

export default function () {
  if (!niri) {
    console.warn('Workspaces_Niri: Niri compositor not active');
    return <box visible={false} />;
  }

  return (
    <box class="taskbar">
      <For each={createBinding(niri, 'windows').as(cs => cs.sort((a, b) => a.workspace.id - b.workspace.id || a.id - b.id))}>{(client: AstalNiri.Window) => Client(client)}</For>
    </box>
  );
}
