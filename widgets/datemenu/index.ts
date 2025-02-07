import { App } from 'astal/gtk3';
import DateMenu from './DateMenu';

export default function datemenu() {
  App.get_monitors().map(DateMenu);
}
