/**
 * 
 * 此插件用来在豆瓣FM中显示歌词
 * 
 */

 window.onload = function(){
  var checkIfDoubanFM = (window.location.host.indexOf("douban.fm") == -1) ? false : true;
  if ( checkIfDoubanFM ) {
    var div_name;
    var text;
    var div_channel_list;

  // 清理local storage
  localStorage.clear();

  // 新建lyric div
  div_name = document.createElement("div");
  text = document.createTextNode("Loading...");
  div_name.appendChild(text);
  div_name.setAttribute("id", "lyricContainer");

  // insert div
  div_channel_list = document.querySelector("#fm-channel-list");
  div_channel_list.parentNode.insertBefore(div_name, div_channel_list);

  // 以500为周期刷新歌曲信息
  setInterval("showSongInformation()", 500);
}
}

/**
 * 通过local storage获取歌曲信息
 * 
 * @return <JSON> info
 */
 function getSongInfo() {
  var info = localStorage.bubbler_song_info;
  info = JSON.parse(info);
  return info;
}

/*
 * 在lyricContainer中显示歌曲信息
 * 
 * @return null
 */
 function showSongInformation() {
  var info = getSongInfo();

  // get song's name
  var name = info.song_name;

  // get song's artist
  var artist = info.artist;
  var div_name;
  var isNameChanged;

  // show song's information
  div_name = document.querySelector("#lyricContainer");
  
  isNameChanged = div_name.getAttribute('data-song-name') !== name;

  // 如果歌曲更新
  if(isNameChanged){
    showSongLyric( name, artist, div_name );   // 显示歌词
  }
}

/**
 * 显示歌词
 * 
 * @param <String> name, <String> artist, <?> div
 * @return null
 */
 function showSongLyric(name, artist, div) {
  var request;
  
  // 如果豆瓣fm在加载中，退出函数
  if (name.search("FM")!=-1)
    return 0;

  // 获取歌词并显示
  request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    var isStatus2xx = request.status / 200 === 1;
    var isStatus304 = request.status === 304;
    if (request.readyState == 4){
      if (isStatus2xx || isStatus304){

        // 更新歌词内容
        updateLyric( div, name, request);
      }else{
        console.log("request error: " + request.status);
      }
    }
  }
  request.open("GET", "http://music.baidu.com/search/lrc?key=" + name + " " + artist, true);
  request.send();
}

/**
 * 更新歌词
 * 
 * @param <?> div, <String> name, <String> request
 * @return null
 */
 function updateLyric(div, name, request) {

  // lyric
  var lyric = request.responseText;
  
  // get lrc
  var lrcURL;
  var lyric_start;
  var lyric_end;

  // set song name to the lyric container
  div.setAttribute('data-song-name', name);

  // if has result, get first result
  lyric_start = lyric.indexOf('<p id="lyricCont-0">');
  if(lyric_start !== -1){

    // get lyric's url
    lrcURL = getLyricURL( lyric );

    // get lyric
    lyric = lyric.substring(lyric_start);
    lyric_end = lyric.indexOf("</p>");
    lyric = lyric.substring(0, lyric_end);   
    
    div.innerHTML = "\n" + lyric;
  }else{
    div.innerHTML = "\n" + "找不到T.T";
  }
}

/**
 * 获取歌曲lrc文件地址
 * 
 * @param <String> lyric
 * @return <String> lrcURL
 */
 function getLyricURL(lyric) {
  var lrcURL = lyric.substring( lyric.indexOf("first_lrc_li") );
  
  lrcURL = lrcURL.substring( lrcURL.indexOf("down-lrc-btn") );
  lrcURL = lrcURL.substring( lrcURL.indexOf("/"), lrcURL.indexOf("}") - 2 );
  lrcURL = "http://music.baidu.com" + lrcURL;

  return lrcURL;
}

// TODO: 读取lrc文件到内存中
/*
function getLyricFile(lrcURL) {
// get lrc file
    var lrc = new Array;
    var request = new XMLHttpRequest();
    request.open("GET", "lrcURL", false);
    request.send();
    lrc = request.responseText().split('\n');
    return lrc;
}
*/
