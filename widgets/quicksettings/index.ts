import { App } from 'astal/gtk3';
import QuickSettings from './QuickSettings';

export default function quicksettings() {
  App.get_monitors().map(QuickSettings);
}
