const axios = require("axios").default;
const fs = require("fs");

const port = 3000 // 运行NeteaseCloudMusicApi的端口号
const id = 871640464 // 需要爬的歌单id
const fileName = "新裤子" // 输出的txt文件名

function getPlaylist(id) {
  return axios(`http://localhost:${port}/playlist/track/all?id=` + id)
    .then((res) => res.data)
    .then((res) => {
      if (res?.code === 200) {
        console.log("getPlaylist succes, songs length:", res?.songs?.length);
        return res.songs;
      }
      return [];
    });
}

function getLyric(id) {
  return axios(`http://localhost:${port}/lyric?id=` + id)
    .then((res) => res.data)
    .then((res) => {
      if (res?.code === 200) {
        console.log("getLyric succes, id: ", id);
        return formatLyric(res.lrc.lyric);
      }
      return "";
    });
}

function formatLyric(str) {
  // 去除换行 时间轴
  // TODO: 演唱者
  return str.replaceAll("\n", " ").replace(/[\[].+?[\]]/g, "");
}

function writeFile(id, data) {
  fs.writeFile(id + ".txt", data, (err, data) => {
    if (err) throw err;
    console.log("success");
  });
}

async function start(id, name) {
  const list = await getPlaylist(id);
  let promises = [];
  list.forEach((item) => {
    if (item.id) promises.push(getLyric(item.id));
  });
  Promise.all(promises).then((res) => {
    const data = res.join("\n");
    writeFile(name, data);
  });
}

start(id, fileName);
