// compress-images.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

/**
 * 指定ディレクトリ配下の画像を再帰的に圧縮し、
 * PNG 形式で出力ディレクトリへ保存する関数
 * @param {string} inputDir  入力ディレクトリ
 * @param {string} outputDir 出力ディレクトリ
 */
async function compressImagesToPng(inputDir, outputDir) {
  // 入力ディレクトリ内の全エントリを取得
  const entries = fs.readdirSync(inputDir, { withFileTypes: true });

  for (const entry of entries) {
    const inPath = path.join(inputDir, entry.name);
    const outPath = path.join(outputDir, entry.name);

    if (entry.isDirectory()) {
      // ディレクトリなら再帰的に処理
      if (!fs.existsSync(outPath)) {
        fs.mkdirSync(outPath, { recursive: true });
      }
      await compressImagesToPng(inPath, outPath);
    } else {
      // ファイルなら拡張子チェック
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        // 圧縮して PNG で出力
        const targetOutPath = outPath.replace(ext, '.png');

        try {
          await sharp(inPath)
            .png({ quality: 80 }) // 画質・圧縮率の指定(0-100)
            .toFile(targetOutPath);

          console.log(`[COMPRESSED] ${inPath} -> ${targetOutPath}`);
        } catch (err) {
          console.error(`[ERROR] Failed to compress: ${inPath}`, err);
        }
      }
    }
  }
}

(async () => {
  // 入力元フォルダ
  const inputDir = path.join(__dirname, 'meal_image');
  // 出力先フォルダ（構造は維持）
  const outputDir = path.join(__dirname, 'compressed-images');

  // 出力ディレクトリが無ければ作成
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    await compressImagesToPng(inputDir, outputDir);
    console.log('--- PNG圧縮完了 ---');
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
})();
