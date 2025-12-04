{
  description = "akir-shell for ags";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      ags,
    }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
      entry = "app.ts";

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
        ++ (with pkgs; [
          libadwaita
          libsoup_3
        ]);

      deps = with pkgs; [
        gtk4
        dart-sass
        # fzf
        hyprpicker
        libnotify
        brightnessctl
        wl-clipboard
        # wf-recorder
        # wayshot
        # slurp
        # swappy
        # cliphist
        # pipewire
        # wireplumber
        # gnome-control-center
        # gnome-calendar
        # gnome-bluetooth
        # swww
        # networkmanager
        # matugen
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
            ags bundle ${entry} $out/bin/${name} -d "SRC='$out/share'"

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
