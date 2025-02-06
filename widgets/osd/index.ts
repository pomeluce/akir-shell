import { App } from 'astal/gtk3';
import OSD from './OSD';

export default function notifications() {
  App.get_monitors().map(OSD);
}
