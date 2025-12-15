import Hyprland from 'gi://AstalHyprland?version=0.1';
import PanelButton from '../panel-button';
import { Icon } from '@/components';
import { createBinding, For } from 'gnim';
import { compositor, configs } from 'options';

const hyprland = compositor() === 'hyprland' ? Hyprland.get_default() : null;

function Client(client: Hyprland.Client) {
  const { flat, monochrome } = configs.bar.taskbar;
  const hyprland = Hyprland.get_default();

  const focused = createBinding(hyprland, 'focusedClient').as(c => c === client);

  return (
    <PanelButton
      flat={flat()}
      suggested={focused}
      color={focused.as(f => (f ? 'primary' : 'regular'))}
      tooltipText={createBinding(client, 'title')}
      onClicked={() => client.focus()}
    >
      <Icon class={focused.as(f => (f ? 'focused' : ''))} fallback="application-x-executable" symbolic={monochrome()} iconName={createBinding(client, 'class')} />
    </PanelButton>
  );
}

export default function () {
  if (!hyprland) {
    console.warn('Workspaces_Hypr: Hyprland compositor not active');
    return <box visible={false} />;
  }

  return (
    <box class="taskbar">
      <For each={createBinding(hyprland, 'clients').as(cs => cs.sort((a, b) => a.workspace.id - b.workspace.id))}>{(client: Hyprland.Client) => Client(client)}</For>
    </box>
  );
}
