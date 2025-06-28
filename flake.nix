{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    ags = {
      url = "github:aylur/ags/045f25bc1c098acee2ad618368bcc6a42f9f35aa";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, ags }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
      rev = self.rev or self.dirtyRev;

      nativeBuildInputs = with pkgs; [
        wrapGAppsHook
        gobject-introspection
        (ags.packages.${system}.default.override {
          extraPackages = buildInputs;
        })
      ];

      buildInputs = (with ags.packages.${system}; [
        io
        astal3
        astal4
        apps
        auth
        battery
        bluetooth
        hyprland
        mpris
        network
        notifd
        powerprofiles
        tray
        wireplumber
      ]) ++ (with pkgs; [ gjs libadwaita ]);

      mkPackage = name:
        pkgs.stdenvNoCC.mkDerivation {
          inherit nativeBuildInputs buildInputs;

          pname = name;
          version = "git";
          src = ./.;

          installPhase = ''
            mkdir -p $out/bin
            ags bundle dist/${name}.ts $out/bin/${name} --define "VERSION='${
              builtins.substring 0 7 rev
            }'"
          '';

          preFixup = ''
             gappsWrapperArgs+=(
              --prefix PATH : ${
                with pkgs;
                lib.makeBinPath (buildInputs ++ [
                  gtk3
                  gtk4
                  dart-sass
                  fzf
                  hyprpicker
                  brightnessctl
                  wl-clipboard
                  wf-recorder
                  wayshot
                  slurp
                  swappy
                  cliphist
                  pipewire
                  wireplumber
                  gnome-control-center
                  gnome-calendar
                  gnome-bluetooth
                  swww
                  networkmanager
                  matugen
                ])
              }
            )
          '';
        };

    in {

      packages.${system} = {
        default = self.packages.${system}.akir-shell;
        astal = ags.packages.${system}.io;

        akir-shell = mkPackage "akir-shell";
        screenrecord = mkPackage "screenrecord";
        screenshot = mkPackage "screenshot";
      };
    };
}
