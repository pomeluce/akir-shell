version=$(cat './version' | xargs)
ags bundle "./build/akirds.ts" "./dist/akirds" --gtk 4 --define "VERSION='$version'" --define "DEV=true"
