import './globals';
import App from 'astal/gtk3/app';
import { start, run } from 'core/lib/main';
import theme from './theme';

export { run };
export function main(name: string, callback: ReturnType<typeof run>) {
  return start({ name, gtk: 3, App, theme, callback });
}
