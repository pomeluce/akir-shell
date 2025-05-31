#!/usr/bin/env zsh


build() {
  name="$1"
  mod="$2"

  year=$(date +%Y)
  copyright="/**\n * Copyright (c) ${year} Mr.Tso\n */"

  version=$(cat './version' | xargs)
  target="$HOME/.local/bin/$name"

  ags bundle "./dist/$name.ts" "$target" --define "VERSION='$version'" --define "DEV=$mod"

  # 检查生成的 target 文件是否存在
  if [[ -f "$target" ]]; then
    # 在文件开头插入 copyright
    # 创建一个临时文件
    temp_file=$(mktemp)

    {
      head -n 1 "$target"
      echo -e "$copyright"
      tail -n +2 "$target"
    } > "$temp_file"

    # 替换原始文件
    mv "$temp_file" "$target"
    chmod +x "$target"
  else
    echo "错误: 目标文件 $target 未生成"
    exit 1
  fi
}

build akir false
build screenrecord false
build screenshot false
