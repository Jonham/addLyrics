/**
* 
* 
* 
* 在fm-channel-list div之前插入fm_lyric div，设置样式
* 
* 
* 
* setLyricStyle(div): 设置lyric div的样式
* getSongInfo(): 从local storage中获取歌曲基本信息
* showSongInformation(): 显示歌曲信息到fm_lyric div中
* showSongLyric(name, artist, div): 显示歌词/“找不到”到fm_lyric div中
* getSongLyric(name, artist, div): 获取歌词（百度歌词搜索歌名+歌手名的第一个结果）
* getLyricURL(lyric): 根据上一项结果获取歌词lrc链接
* updateLyric(div, name, request): 更新歌词
* 
* 
* 
**/

window.onload = function(){
    // 清理local storage
    localStorage.clear();

    // 新建lyric div
    var div_name = document.createElement("div");
    var text = document.createTextNode("Loading...");
    div_name.appendChild(text);
    div_name.setAttribute("id", "fm_lyric");
    // 设置div样式
    setLyricStyle(div_name);

    // insert div
    var div_channel_list = document.getElementById("fm-channel-list");
    div_channel_list.parentNode.insertBefore(div_name, div_channel_list);

    // 以500为周期刷新歌曲信息
    setInterval("showSongInformation()", 500);
}

function setLyricStyle(div) {
// 设置lyric div的style
    div.style.position = "relative";
    div.style.left = "40px";
    div.style.top = "10px";
    div.style.width = "240px";
    div.style.height = "400px";
    div.style.overflow = "auto";
    div.style.zIndex = "1";
}

function getSongInfo() {
// get song's info via local storage
    var info = localStorage.bubbler_song_info;
    info = JSON.parse(info);
    return info;
}

function showSongInformation() {
// show song's information in fm_lyric div
    var info = getSongInfo();
    var name = info.song_name;   // get song's name
    var artist = info.artist;   // get song's name

    // show song's information
    var div_name = document.getElementById("fm_lyric");
    
    var isNameChange = div_name.innerHTML.search(name) == -1;
    // 如果歌曲更新
    if(isNameChange){
        showSongLyric( name, artist, div_name );   // 显示歌词
    }
}

function showSongLyric(name, artist, div) {
// get lyric
    // 如果豆瓣fm在加载中，退出函数
    if (name.search("FM")!=-1)
        return 0;

    // 获取歌词并显示
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        var isStatus2xx = request.status / 200 === 1;
        var isStatus304 = request.status === 304;
        if (request.readyState == 4){
            if (isStatus2xx || isStatus304){
                updateLyric( div, name, request);   // 更新歌词内容
            }else{
                console.log("request error: " + request.status);
            }
        }
    }
    request.open("GET", "http://music.baidu.com/search/lrc?key=" + name + " " + artist, true);
    request.send();
    
}

function updateLyric(div, name, request) {
// update lyric div

    // lyric
    var lyric = request.responseText;
    // get lrc
    var lrcURL;
    
    // if has result, get first result
    var lyric_start = lyric.indexOf("<p id=\"lyricCont-0\">");
    if(lyric_start != -1){
        // get lyric's url
        lrcURL = getLyricURL( lyric );
        //console.log(getLyricFile(lrcURL)):

        // get lyric
        lyric = lyric.substring(lyric_start);
        var lyric_end = lyric.indexOf("</p>");
        lyric = lyric.substring(0, lyric_end);   
        
        div.innerHTML = name + "\n" + lyric;
    }else{
        div.innerHTML = name + "\n" + "找不到T.T";
    }
}

function getLyricURL(lyric) {
// get song's lrc url
    var lrcURL = lyric.substring( lyric.indexOf("first_lrc_li") );
    lrcURL = lrcURL.substring( lrcURL.indexOf("down-lrc-btn") );
    lrcURL = lrcURL.substring( lrcURL.indexOf("/"), lrcURL.indexOf("}") - 2 );
    lrcURL = "http://music.baidu.com" + lrcURL;

    return lrcURL;
}


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