import { App } from 'astal/gtk3';
import ClipBoard from './ClipBoard';

export default function clipboard() {
  App.get_monitors().map(ClipBoard);
}
