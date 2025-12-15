{
  description = "akir-shell for ags";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    astal = {
      url = "github:sameoldlab/astal/feat/niri";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      ags,
      astal,
    }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
      entry = "app.ts";
      version = builtins.replaceStrings [ "\n" ] [ "" ] (builtins.readFile ./version);

      nativeBuildInputs = with pkgs; [
        wrapGAppsHook3
        gobject-introspection
        (ags.packages.${system}.default.override {
          extraPackages = buildInputs;
        })
      ];

      buildInputs =
        (with ags.packages.${system}; [
          io
          astal4
          apps
          battery
          bluetooth
          hyprland
          mpris
          network
          notifd
          powerprofiles
          tray
          wireplumber
        ])
        ++ (with astal.packages.${system}; [
          niri
        ])
        ++ (with pkgs; [
          libadwaita
          libsoup_3
        ]);

      deps = with pkgs; [
        gtk4
        dart-sass
        hyprpicker
        libnotify
        brightnessctl
        wl-clipboard
        # wf-recorder
        # wayshot
        # slurp
        # swappy
        cliphist
        pipewire
        wireplumber
        gnome-control-center
        gnome-calendar
        gnome-bluetooth
        networkmanager
      ];

      mkPackage =
        name:
        pkgs.stdenv.mkDerivation {
          inherit nativeBuildInputs buildInputs;
          pname = name;
          version = "git";
          src = ./.;

          installPhase = ''
            runHook preInstall

            mkdir -p $out/bin
            mkdir -p $out/share
            cp -r * $out/share
            ags bundle ${entry} $out/bin/${name} -d "SRC='$out/share'" -d "VERSION='${version}'" -d "DEV=true"

            runHook postInstall
          '';
          preFixup = ''
             gappsWrapperArgs+=(
              --prefix PATH : ${with pkgs; lib.makeBinPath (buildInputs ++ deps)}
            )
          '';
        };
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        nativeBuildInputs = nativeBuildInputs ++ deps;
      };

      packages.${system} = {
        default = self.packages.${system}.akirds;
        akirds = mkPackage "akirds";
      };
    };
}
