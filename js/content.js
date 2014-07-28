/**
* 
* 在fm-channel-list div之前插入fm_lyric div，设置样式
* getSongInfo(): 从local storage中获取歌曲基本信息
* showSongInformation(): 显示歌词到fm_lyric div中
* getSongLyric(name, artist): 获取歌词（百度歌词搜索歌名+歌手名的第一个结果）
* getLyricURL(lyric): 根据上一项结果获取歌词lrc链接
* 
**/

window.onload = function(){
    // remove local storage
    localStorage.clear();

    // create div of lyric
    var div_name = document.createElement("div");
    var name = document.createTextNode("Lyric");
    div_name.appendChild(name);
    div_name.setAttribute("id", "fm_lyric");

    // insert div
    var div_channel_list = document.getElementById("fm-channel-list");
    div_channel_list.parentNode.insertBefore(div_name, div_channel_list);

    // set div's css
    div_name.style.position = "relative";
    div_name.style.left = "40px";
    div_name.style.top = "10px";
    div_name.style.width = "240px";
    div_name.style.height = "400px";
    div_name.style.overflow = "auto";
    div_name.style.zIndex = "1";

    // remove ad
    var fm_ads = document.getElementById("fm-rotate-ad");
    //fm_ads.parentNode.removeChild(fm_ads);

    // show lyric
    setInterval("showSongInformation()", 500);
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
    var isNameChange = div_name.innerHTML.search(name);

    // if name change, get lyric
    if( isNameChange == -1){
        var lyric = getSongLyric( name, artist );   // get song's lyric
        div_name.innerHTML = lyric;
    }
}

function getSongLyric( name, artist ) {
// get lyric
    if (name.search("FM")==-1){
        var request = new XMLHttpRequest();
        request.open("GET", "http://music.baidu.com/search/lrc?key=" + name + " " + artist, false);
        request.send();

        // lyric
        var lyric = request.responseText;
        // get lrc
        var lrcURL;
        
        // if has result, get first result
        var lyric_start = lyric.indexOf("<p id=\"lyricCont-0\">");
        if(lyric_start != -1){
            // get lyric's url
            lrcURL = getLyricURL( lyric );

            // get lyric
            lyric = lyric.substring(lyric_start);
            var lyric_end = lyric.indexOf("</p>");
            lyric = lyric.substring(0, lyric_end);   
            
            // console.log(lrcURL);
        }else {
            return "找不到歌词T.T";
        }

        return lyric;
    }

    return "Loading...";
}

function getLyricURL( lyric ) {
// get song's lrc url
    var lrcURL = lyric.substring( lyric.indexOf("first_lrc_li") );
    lrcURL = lrcURL.substring( lrcURL.indexOf("down-lrc-btn") );
    lrcURL = lrcURL.substring( lrcURL.indexOf("/"), lrcURL.indexOf("}") - 2 );
    lrcURL = "http://music.baidu.com" + lrcURL;

    return lrcURL;
}

function getLyricFile( lrcURL ) {

}