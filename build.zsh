#!/usr/bin/env zsh

year=$(date +%Y)
copyright="/**\n * Copyright (c) ${year} Mr.Jor\n */"

version=$(cat './version' | xargs)
target="$HOME/.local/bin/akir"

ags bundle './akir.ts' "$target" --define "VERSION='${version}'" --define "DEV=false"

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
