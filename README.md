# akir-shell

A desktop shell based on Ags. Currently supports Hyprland and Niri.

> [!IMPORTANT]
>
> The current version is based on AGS v3. For previous versions, please visit [akir-shell v2](https://github.com/pomeluce/akir-shell/tree/v2).

## Screenshots

![1](https://imgur.com/kW04wZ5.jpeg)

![2](https://imgur.com/aqQWk1K.jpeg)

![3](https://imgur.com/sW9k76R.jpeg)

![4](https://imgur.com/L9AFDQy.jpeg)

## Quick Start Guide

1. Include this repo as an input to your flake.

```nix
# flake.nix
{
  inputs = {
    akirds = {
      url = "github:pomeluce/akir-shell";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };
}
```

2. Override the package

```nix
{ pkgs, inputs, ... }:
let
  akirds = inputs.akirds.packages.${pkgs.system}.akirds;
in
{
  # using home-manager
  home.packages = [ akirds ];

  # using configuration.nix
  environment.systemPackages = [ akirds ];
}
```

3. ReBuild you NixOS

```shell
sudo nixos-rebuild switch --flake /your/nixos/config-path
```

4. Run

```shell
akirds # main program and bar

akirds -t datemenu
akirds -t launcher
akirds -t quicksettings
akirds -t dock

akirds -q # quit

akirds eval launcher app # toggle application
akirds eval launcher clipbord # toggle clipboard
```
