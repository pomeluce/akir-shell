import Niri from './taskbar/niri';
import Hyprland from './taskbar/hyprland';
import { With } from 'gnim';
import { compositor } from 'options';

export default function () {
  return (
    <box>
      <With value={compositor}>{comp => (comp === 'niri' ? <Niri /> : comp === 'hyprland' ? <Hyprland /> : <box />)}</With>
    </box>
  );
}
