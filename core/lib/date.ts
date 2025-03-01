import { GLib, Variable } from 'astal';

export const pollTime = (seconds: number) => Variable(GLib.DateTime.new_now_local()).poll(seconds * 1000, () => GLib.DateTime.new_now_local());

export const uptime = Variable(0).poll(60_000, 'cat /proc/uptime', line => Number.parseInt(line.split('.')[0]) / 60);
