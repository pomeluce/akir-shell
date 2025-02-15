#!/usr/bin/gjs -m
import { main, run } from 'gtk/main';

main(
  'akir',
  run(
    import('../widgets/launcher'),
    import('../widgets/bar'),
    import('../widgets/powermenu'),
    import('../widgets/osd'),
    import('../widgets/notifications'),
    import('../widgets/dock'),
    import('../widgets/drawer'),
    import('../widgets/quicksettings'),
    import('../widgets/datemenu'),
  ),
);
