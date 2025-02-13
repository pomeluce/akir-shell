import { execAsync } from 'astal';
import Apps from 'gi://AstalApps';

/* 解决 hyprland gnome 程序启动不加载系统环境问题 */
export function appLunch(app: Apps.Application) {
  const isGnome = app.iconName.includes('org.gnome');
  isGnome ? execAsync(app.executable.split(' ')[0]).catch(console.error) : app.launch();
}
