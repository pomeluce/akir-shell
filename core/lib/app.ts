import { execAsync } from 'astal';
import Apps from 'gi://AstalApps';
import options from 'options';

const { theme } = options;

/* 解决 hyprland gnome 程序启动不加载系统环境问题 */
export function appLunch(app: Apps.Application) {
  const isGnome = app.iconName.includes('org.gnome');
  isGnome ? execAsync(`env GTK_THEME=${theme.scheme.theme[theme.scheme.mode.get()].get()} ${app.executable.replace('%U', '')}`).catch(console.error) : app.launch();
}
