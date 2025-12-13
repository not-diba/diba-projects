import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import path from "path";

// Directories to process
const directories = ["./public/crafts", "./public/writing"];

// Configuration
const config = {
  formats: {
    webp: { quality: 80 },
    avif: { quality: 70, effort: 6 },
  },
  // Optionally resize large images
  maxWidth: 2000, // Set to null to keep original size
  maxHeight: 2000,
};

async function optimizeImage(inputPath, filename, directory) {
  const name = filename.replace(/\.(jpg|jpeg|png)$/i, "");

  console.log(`\n📸 Processing: ${filename}`);

  try {
    // Get original file size
    const originalStats = await stat(inputPath);
    const originalSize = (originalStats.size / 1024).toFixed(2);
    console.log(`   Original: ${originalSize}KB`);

    // Load image and get metadata
    let image = sharp(inputPath);
    const metadata = await image.metadata();

    // Resize if too large (optional)
    if (config.maxWidth || config.maxHeight) {
      image = image.resize(config.maxWidth, config.maxHeight, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // Convert to WebP
    console.log(`   ⚙️  Creating WebP...`);
    const webpPath = path.join(directory, `${name}.webp`);
    await image.clone().webp(config.formats.webp).toFile(webpPath);

    const webpStats = await stat(webpPath);
    const webpSize = (webpStats.size / 1024).toFixed(2);
    const webpSavings = (
      (1 - webpStats.size / originalStats.size) *
      100
    ).toFixed(0);
    console.log(`   ✅ WebP: ${webpSize}KB (${webpSavings}% smaller)`);

    // Convert to AVIF
    console.log(`   ⚙️  Creating AVIF...`);
    const avifPath = path.join(directory, `${name}.avif`);
    await image.clone().avif(config.formats.avif).toFile(avifPath);

    const avifStats = await stat(avifPath);
    const avifSize = (avifStats.size / 1024).toFixed(2);
    const avifSavings = (
      (1 - avifStats.size / originalStats.size) *
      100
    ).toFixed(0);
    console.log(`   ✅ AVIF: ${avifSize}KB (${avifSavings}% smaller)`);
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
  }
}

async function processDirectory(directory) {
  console.log(`\n📁 Processing directory: ${directory}`);

  try {
    const files = await readdir(directory);
    const imageFiles = files.filter(
      (f) => /\.(jpg|jpeg|png)$/i.test(f) && !/\.(webp|avif)$/i.test(f), // Skip already converted files
    );

    if (imageFiles.length === 0) {
      console.log(`   ⚠️  No images found`);
      return;
    }

    console.log(`   Found ${imageFiles.length} image(s)`);

    for (const file of imageFiles) {
      const inputPath = path.join(directory, file);
      await optimizeImage(inputPath, file, directory);
    }
  } catch (error) {
    console.error(`   ❌ Error reading directory: ${error.message}`);
  }
}

async function main() {
  console.log("🖼️  Image Optimization Script\n");
  console.log("Configuration:");
  console.log(`  WebP Quality: ${config.formats.webp.quality}`);
  console.log(`  AVIF Quality: ${config.formats.avif.quality}`);
  if (config.maxWidth || config.maxHeight) {
    console.log(`  Max Dimensions: ${config.maxWidth}x${config.maxHeight}`);
  }

  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const directory of directories) {
    await processDirectory(directory);
  }

  console.log("\n\n✨ Image optimization complete!");
}

main();
