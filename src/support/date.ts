import { createPoll } from 'ags/time';
import GLib from 'gi://GLib?version=2.0';

export const pollTime = (seconds: number) => createPoll(GLib.DateTime.new_now_local(), seconds * 1000, () => GLib.DateTime.new_now_local());

export const uptime = createPoll(0, 60_000, 'cat /proc/uptime', line => Number.parseInt(line.split('.')[0]) / 60);
