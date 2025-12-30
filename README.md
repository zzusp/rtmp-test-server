# RTMP视频服务器

简易的RTMP服务器，用于接收FFmpeg推送的视频流并在网页上播放。

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动服务器

```bash
npm start
```

服务器启动后会显示：
- RTMP推流地址: `rtmp://localhost:1935/live/STREAM_NAME`
- HTTP服务器: `http://localhost:3000`
- HLS播放地址: `http://localhost:8000/live/STREAM_NAME/index.m3u8`

### 3. 使用FFmpeg推流

```bash
# 推流本地视频文件
ffmpeg -re -i your_video.mp4 -c copy -f flv rtmp://localhost:1935/live/test

# 推流摄像头（Windows）
ffmpeg -f dshow -i video="摄像头名称" -c:v libx264 -preset ultrafast -tune zerolatency -f flv rtmp://localhost:1935/live/test

# 推流屏幕（Windows）
ffmpeg -f gdigrab -framerate 30 -i desktop -c:v libx264 -preset ultrafast -tune zerolatency -f flv rtmp://localhost:1935/live/test
```

### 4. 在网页上播放

1. 打开浏览器访问: `http://localhost:3000`
2. 输入流名称（例如: `test`）
3. 点击"播放视频"按钮

## 端口说明

- **1935**: RTMP推流端口
- **8000**: HLS播放端口（用于获取m3u8文件）
- **3000**: HTTP服务器端口（网页访问）

## 技术栈

- **后端**: Node.js + node-media-server
- **前端**: HTML5 + HLS.js
- **流协议**: RTMP (推流) → HLS (播放)

## 注意事项

1. 确保防火墙允许1935、8000、3000端口
2. 推流时流名称要与播放时输入的流名称一致
3. 如果播放失败，请检查FFmpeg是否正在推流

