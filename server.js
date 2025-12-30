const NodeMediaServer = require('node-media-server');
const express = require('express');
const path = require('path');
const { execSync } = require('child_process');

const app = express();
const PORT = 3000;

// 静态文件服务
app.use(express.static('public'));

// 启动HTTP服务器
app.listen(PORT, () => {
  console.log(`HTTP服务器运行在 http://localhost:${PORT}`);
});

// 自动检测ffmpeg路径
let ffmpegPath = 'ffmpeg'; // 默认值
try {
  if (process.platform === 'win32') {
    const result = execSync('where.exe ffmpeg', { encoding: 'utf8' }).trim();
    if (result) {
      ffmpegPath = result.split('\n')[0].trim();
      console.log(`✅ 检测到ffmpeg路径: ${ffmpegPath}`);
    }
  } else {
    const result = execSync('which ffmpeg', { encoding: 'utf8' }).trim();
    if (result) {
      ffmpegPath = result;
      console.log(`✅ 检测到ffmpeg路径: ${ffmpegPath}`);
    }
  }
} catch (error) {
  console.warn('⚠️ 无法自动检测ffmpeg路径，使用默认值: ffmpeg');
  console.warn('   如果转码失败，请手动设置ffmpeg完整路径');
}

// RTMP服务器配置
const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*',
    mediaroot: './media',
  },
  trans: {
    ffmpeg: ffmpegPath,
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]'
      }
    ]
  }
};

const nms = new NodeMediaServer(config);

nms.on('preConnect', (id, args) => {
  console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('postConnect', (id, args) => {
  console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('prePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('postPublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  console.log(`✅ 流已发布: rtmp://localhost:1935${StreamPath}`);
  console.log(`📺 播放地址: http://localhost:8000${StreamPath}/index.m3u8`);
});

nms.on('prePlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('postPlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('doneConnect', (id, args) => {
  console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('donePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  console.log(`❌ 流已停止: ${StreamPath}`);
});

// 监听转码事件
nms.on('preTranscode', (id, StreamPath, args) => {
  console.log('[转码开始]', `id=${id} StreamPath=${StreamPath}`);
});

nms.on('postTranscode', (id, StreamPath, args) => {
  console.log('[转码完成]', `id=${id} StreamPath=${StreamPath}`);
});

nms.on('doneTranscode', (id, StreamPath, args) => {
  console.log('[转码结束]', `id=${id} StreamPath=${StreamPath}`);
});

nms.run();

console.log('🚀 RTMP服务器启动成功!');
console.log(`📡 RTMP推流地址: rtmp://localhost:1935/live/STREAM_NAME`);
console.log(`🌐 HTTP服务器: http://localhost:${PORT}`);
console.log(`📺 HLS播放地址: http://localhost:8000/live/STREAM_NAME/index.m3u8`);

