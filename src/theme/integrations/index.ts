import app from 'ags/gtk4/app';
import gsettings from './gsettings';
import hyprland from './hyprland';

export type IntegrationProps = { App: typeof app };

type Integration = {
  init?: (props: IntegrationProps) => Promise<any>;
  reset?: (props: IntegrationProps) => Promise<any>;
};

const integrations: Array<Integration> = [hyprland, gsettings];

export default integrations;
