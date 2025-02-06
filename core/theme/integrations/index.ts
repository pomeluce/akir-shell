import type App3 from 'astal/gtk3/app';
import type App4 from 'astal/gtk4/app';

import gsettings from './gsettings';
import hyprland from './hyprland';
import swww from './swww';
import tmux from './tmux';

export type IntegrationProps = {
  App: typeof App3 | typeof App4;

  Astal: typeof import('gi://Astal?version=3.0').Astal | typeof import('gi://Astal?version=4.0').Astal;
};

type Integration = {
  init?: (props: IntegrationProps) => Promise<any>;
  reset?: (props: IntegrationProps) => Promise<any>;
};

const integrations: Array<Integration> = [hyprland, swww, tmux, gsettings];

export default integrations;
