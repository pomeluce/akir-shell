import { App } from 'astal/gtk3';
import { Binding } from 'astal';
import { execAsync } from 'astal';
import Separator from 'gtk/primitive/Separator';
import Box from 'gtk/primitive/Box';
import FlatButton from 'gtk/primitive/FlatButton';
import options from '../../options';
import type { Nixpkg } from '.';

function NixPkgButton({ pname, version, description }: Nixpkg) {
  const { pkgs } = options.nix;

  return (
    <FlatButton
      hexpand
      onClicked={() => {
        App.get_window('launcher')!.visible = false;
        execAsync(`nix run ${pkgs.get()}#${pname}`).catch(console.error);
      }}
    >
      <Box vertical m="md" px="2xl">
        <box hexpand={false}>
          <label label={pname} />
          <box hexpand={true} />
          <label label={version} />
        </box>
        <label wrap className="flat" halign={START} xalign={0} label={description} />
      </Box>
    </FlatButton>
  );
}

type Props = {
  pkgs: Binding<Array<Nixpkg>>;
  loading: Binding<boolean>;
};

export default function ({ pkgs, loading }: Props) {
  return (
    <revealer transitionType={SLIDE_DOWN} revealChild={pkgs.as(pkgs => pkgs.length > 0)}>
      <Box visible={loading.as(l => !l)} vertical pb="xl">
        {pkgs.as(pkgs =>
          pkgs.map(pkg => (
            <box vertical>
              <Separator />
              <NixPkgButton {...pkg} />
            </box>
          )),
        )}
      </Box>
    </revealer>
  );
}
