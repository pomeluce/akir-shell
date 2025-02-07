import { GLib, Variable } from 'astal';

export const clock = Variable(GLib.DateTime.new_now_local()).poll(1000, () => GLib.DateTime.new_now_local());

export const uptime = Variable(0).poll(60_000, 'cat /proc/uptime', line => Number.parseInt(line.split('.')[0]) / 60);
