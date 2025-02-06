import Icon from 'gtk/primitive/Icon';
import Hyprland from 'gi://AstalHyprland';
import PanelButton from '../PanelButton';
import { bind } from 'astal';
import options from '../options';

function Client(client: Hyprland.Client) {
  const { flat, monochrome } = options.taskbar;
  const hyprland = Hyprland.get_default();

  const focused = bind(hyprland, 'focusedClient').as(c => c === client);

  return (
    <PanelButton flat={flat()} suggested={focused} color={focused.as(f => (f ? 'primary' : 'regular'))} tooltipText={bind(client, 'title')} onClicked={() => client.focus()}>
      <Icon className={focused.as(f => (f ? 'focused' : ''))} fallback="application-x-executable" symbolic={monochrome()} icon={bind(client, 'class')} />
    </PanelButton>
  );
}

export default function () {
  const hyprland = Hyprland.get_default();

  return <box className="Taskbar">{bind(hyprland, 'clients').as(cs => cs.sort((a, b) => a.workspace.id - b.workspace.id).map(Client))}</box>;
}
