import { exec } from "child_process";
import { promisify } from "util";
import { readdir, stat, mkdir, copyFile, unlink } from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

// Configuration
const config = {
  inputDir: "./public/crafts",
  outputDir: "./public/crafts",
  backupDir: "./crafts-backup-local", // Local backup (add to .gitignore)
  formats: ["mp4", "webm"],
  quality: {
    mp4: 28, // CRF value (lower = better quality, 23-28 is good)
    webm: 35, // CRF value for WebM (30-40 is good)
  },
  resolution: "1280:720", // HD resolution
  fps: 30,
  maxDuration: 5, // seconds
};

async function optimizeVideo(inputPath, filename) {
  const name = path.parse(filename).name;
  const ext = path.parse(filename).ext;

  // Use temp directory to avoid in-place editing issues
  const tempDir = path.join(config.outputDir, ".temp");
  await mkdir(tempDir, { recursive: true });

  const tempBase = path.join(tempDir, name);
  const outputBase = path.join(config.outputDir, name);

  console.log(`\n🎬 Processing: ${filename}`);

  try {
    // Backup original if backup directory is specified
    if (config.backupDir) {
      await mkdir(config.backupDir, { recursive: true });
      const backupPath = path.join(config.backupDir, filename);
      await copyFile(inputPath, backupPath);
      console.log(`   💾 Backed up to: ${backupPath}`);
    }

    // Ensure output directory exists
    await mkdir(config.outputDir, { recursive: true });

    // Get video info
    const { stdout: info } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${inputPath}"`,
    );
    const duration = parseFloat(info.trim());

    console.log(`   Duration: ${duration.toFixed(2)}s`);

    // Trim if longer than maxDuration
    const durationFlag =
      duration > config.maxDuration ? `-t ${config.maxDuration}` : "";

    // Generate MP4 (H.265/HEVC for better compression)
    if (config.formats.includes("mp4")) {
      console.log(`   ⚙️  Creating MP4...`);
      const tempMp4 = `${tempBase}.mp4`;
      const finalMp4 = `${outputBase}.mp4`;

      await execAsync(
        `
        ffmpeg -i "${inputPath}" ${durationFlag}
        -c:v libx265 
        -crf ${config.quality.mp4}
        -preset fast
        -vf "scale='if(mod(iw,2),iw-1,iw)':'if(mod(ih,2),ih-1,ih)':force_original_aspect_ratio=decrease,scale=${config.resolution}:force_original_aspect_ratio=decrease,fps=${config.fps}"
        -movflags +faststart
        -an
        -y "${tempMp4}"
      `.replace(/\s+/g, " "),
      );

      // Move from temp to final location
      await copyFile(tempMp4, finalMp4);
      await unlink(tempMp4);

      const stats = await stat(finalMp4);
      console.log(
        `   ✅ MP4 created: ${(stats.size / 1024 / 1024).toFixed(2)}MB`,
      );
    }

    // Generate WebM (VP9 for better compression)
    if (config.formats.includes("webm")) {
      console.log(`   ⚙️  Creating WebM...`);
      const tempWebm = `${tempBase}.webm`;
      const finalWebm = `${outputBase}.webm`;

      await execAsync(
        `
        ffmpeg -i "${inputPath}" ${durationFlag}
        -c:v libvpx-vp9
        -crf ${config.quality.webm}
        -b:v 0
        -vf "scale='if(mod(iw,2),iw-1,iw)':'if(mod(ih,2),ih-1,ih)':force_original_aspect_ratio=decrease,scale=${config.resolution}:force_original_aspect_ratio=decrease,fps=${config.fps}"
        -an
        -y "${tempWebm}"
      `.replace(/\s+/g, " "),
      );

      // Move from temp to final location
      await copyFile(tempWebm, finalWebm);
      await unlink(tempWebm);

      const stats = await stat(finalWebm);
      console.log(
        `   ✅ WebM created: ${(stats.size / 1024 / 1024).toFixed(2)}MB`,
      );
    }

    // Generate thumbnail (for poster)
    console.log(`   📸 Creating thumbnail...`);
    const tempPoster = `${tempBase}.jpg`;
    const finalPoster = `${outputBase}.jpg`;

    await execAsync(
      `
      ffmpeg -i "${inputPath}"
      -ss 00:00:01
      -vframes 1
      -vf "scale='if(mod(iw,2),iw-1,iw)':'if(mod(ih,2),ih-1,ih)':force_original_aspect_ratio=decrease,scale=${config.resolution}:force_original_aspect_ratio=decrease"
      -q:v 2
      -y "${tempPoster}"
    `.replace(/\s+/g, " "),
    );

    // Move from temp to final location
    await copyFile(tempPoster, finalPoster);
    await unlink(tempPoster);

    console.log(`   ✅ Thumbnail created`);

    // Clean up temp directory
    try {
      await unlink(tempDir);
    } catch (e) {
      // Directory might not be empty, that's ok
    }

    // If input and output dirs are the same, delete the original
    if (config.inputDir === config.outputDir) {
      await unlink(inputPath);
      console.log(`   🗑️  Removed original ${filename}`);
    }
  } catch (error) {
    console.error(`   ❌ Error processing ${filename}:`, error.message);
  }
}

async function main() {
  console.log("🎥 Video Optimization Script\n");
  console.log("Configuration:");
  console.log(`  Input: ${config.inputDir}`);
  console.log(`  Output: ${config.outputDir}`);
  console.log(
    `  Backup: ${config.backupDir || "None (⚠️  originals will be lost!)"}`,
  );
  console.log(`  Resolution: ${config.resolution}`);
  console.log(`  FPS: ${config.fps}`);
  console.log(`  Max Duration: ${config.maxDuration}s`);

  // Safety warning if no backup
  if (config.inputDir === config.outputDir && !config.backupDir) {
    console.log("\n⚠️  WARNING: No backup directory set!");
    console.log(
      "⚠️  Original files will be PERMANENTLY DELETED after optimization.",
    );
    console.log("\nPress Ctrl+C to cancel, or wait 5 seconds to continue...\n");
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  try {
    const files = await readdir(config.inputDir);
    const videoFiles = files.filter((f) =>
      /\.(mp4|mov|avi|mkv|webm)$/i.test(f),
    );

    if (videoFiles.length === 0) {
      console.log("\n⚠️  No video files found in input directory");
      return;
    }

    console.log(`\nFound ${videoFiles.length} video(s)\n`);

    for (const file of videoFiles) {
      const inputPath = path.join(config.inputDir, file);
      await optimizeVideo(inputPath, file);
    }

    console.log("\n\n✨ All videos optimized successfully!");
    console.log(`\nOutputs saved to: ${config.outputDir}`);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

main();
