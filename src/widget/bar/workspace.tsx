import Niri from './workspace/niri';
import Hyprland from './workspace/hyprland';
import { With } from 'gnim';
import { Gdk } from 'ags/gtk4';
import { compositor } from 'options';

export default (monitor: Gdk.Monitor) => {
  return (
    <box>
      <With value={compositor}>{comp => (comp === 'niri' ? <Niri monitor={monitor} /> : comp === 'hyprland' ? <Hyprland /> : <box />)}</With>
    </box>
  );
};
