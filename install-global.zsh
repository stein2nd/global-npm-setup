#!/bin/zsh

# スクリプトの場所に移動（package.json と同じディレクトリにするため）
cd "$(dirname "$0")"

echo "📦 グローバル npm パッケージをインストール中..."

# 実行（package.json に記載されたものをグローバルにインストール）
npm install -g

echo "✅ インストール完了しました。"
