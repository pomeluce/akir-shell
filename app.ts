import { main, run } from '@/main';
import app from 'ags/gtk4/app';

main({ name: 'akirds', app: app, callback: run(import('@/windows/bar'), import('@/windows/qs'), import('@/windows/powermenu')) });
