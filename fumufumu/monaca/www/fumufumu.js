// This is a JavaScript file
//////////////////////////////////////////////////////////
// 開発　市川電産 & Code for Numazu  2016/1/23
//////////////////////////////////////////////////////////

// グローバル変数
var         p_data;                 // JSON地点データの取り込み
var         ymap;                   // Yahoo地図
var         PosNo = -1;             // 登録番号
var         GuideText;              // ボタンのテキスト
var         GPSFlg = false;         // GPSのOn/Off
var         lastlat, lastlng;       // 最終の緯度経度の保存
var         startlat = 35.1027564;  // 初期位置緯度
var         startlng = 138.857582;  // 初期位置経度
var         Limit = 0.05;           // 認識する範囲
var         syncerWatchPosition = {
    count: 0 ,
    lastTime: 0 ,
    map: null ,
	marker: null ,
};


/////////////////////////////////
// 地点JSONの取り込み
/////////////////////////////////
$(function() {
    $.getJSON("json/position.json" , function(data) {
        // データの保存用
        p_data = data;

        // 画像アイコンの準備
        // ジャンルを追加する際は、ここを修正する
        var icon = [];
        icon[ 0 ] = new Y.Icon('images/saru-mae.png');          // 歴史　赤
        icon[ 1 ] = new Y.Icon('images/saru_40_blue.png');      // 自然　青
        icon[ 2 ] = new Y.Icon('images/saru_40_yellow.png');    // その他　黄色
        icon[ 3 ] = new Y.Icon('images/saru_40_purple.png');    // 文化　紫
        icon[ 4 ] = new Y.Icon('images/saru_40_green.png');     // 産業　緑

        // マーカー配列の準備
        var marker = [];

        // データ個数分、アイコンデータ作成する
        for( var ix = 0; ix < p_data.length; ix++ ){
            marker[ ix ] = new Y.Marker(new Y.LatLng( p_data[ ix ].latitude, p_data[ ix ].longitude), {icon: icon[p_data[ ix ].kind], title: p_data[ ix ].name});
            marker[ ix ].__label__ = p_data[ ix ].name;         // 地点の名称
            marker[ ix ].id        = p_data[ ix ].id;         // 音声案内用の読み
            marker[ ix ].yomi      = p_data[ ix ].yomi;         // 音声案内用の読み
            marker[ ix ].latitude  = p_data[ ix ].latitude;     // 緯度
            marker[ ix ].longitude = p_data[ ix ].longitude;    // 経度
            // 吹き出しの中身を作成
            marker[ ix ].bindInfoWindow('<a href=\"' + p_data[ ix ].link + '\" target=\"_blank\">' + p_data[ ix ].name + '</a>');
            // マウスが載っている時
            marker[ ix ].bind('mouseover', onmouseover);
            // マウスが外れた時
            marker[ ix ].bind('mouseout', onmouseout);
            // クリック時の処理
            marker[ ix ].bind('click', onclick);
            ymap.addFeature( marker[ ix ] );
        }
    });
});

///////////////////////////////////////
// Webの初期化
///////////////////////////////////////
function init(){
    console.log( "init" );

    // Yahoo地図の初期化
    ymap = new Y.Map("ymapDiv"),
        onmouseover = function(){
        },
        onmouseout = function(){
            $('#output').html('');
        },
        onclick = function(){
            if( this.yomi != null ){
                GuideText = this.__label__;
                DataRead( this.id );
            }
        };

    ////////////////////////////////////
    // 移動処理
    ////////////////////////////////////
    ymap.bind( "moveend" , function() {
        var nowpos = ymap.getCenter();
        console.log( "Move" );                
        
        // 近傍地点を確認する
        for( var ix = 0; ix < p_data.length; ix++ ){
            // 50m以下 / 0.1 = 100m
            if( getDistance( nowpos.lat(), nowpos.lng(), p_data[ ix ].latitude, p_data[ ix ].longitude ) < Limit ){
                console.log( "move " + ix );
                // 以前の番号と違ければデータを取り込む
                if( PosNo != ix ){
                    PosNo = ix;
                    GuideText = p_data[ ix ].name;
                    DataRead( p_data[ ix ].id );
                }
            }
        }
    });

    // 描画
    ymap.drawMap(new Y.LatLng( startlat, startlng), 17, Y.LayerSetId.NORMAL);
    lastlat = startlat;
    lastlng = startlng;

    // ズームボタン
    var control = new Y.ZoomControl();
    ymap.addControl(control);
}

//////////////////////////////////////
// データ取り込み
//////////////////////////////////////
function DataRead(guidestr){
    xhr = new XMLHttpRequest();
    // 音声返却サイトは各自用意する
    xhr.open('POST', '（各自のサイトを設定してください）/say.php', true);
    xhr.responseType = 'arraybuffer';
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    // Postの結果が帰ってきたら、BASE64変換
    xhr.onload = function (e) {
        console.log("load");
        if( this.status == 200){
            var view = new Uint8Array(this.response);
            var binaryData = "";
            for (var i = 0, len = view.byteLength; i < len; i++) {
              binaryData += String.fromCharCode(view[i]);
            }
            // 音声の形式は、各自に合わせてください
            var b64 =  "data:audio/mpeg;base64," + window.btoa(binaryData);

            audio = new Audio( b64 );
            audio.load();
            audio.play();
            // 音声ボタンのオンオフ
            document.getElementById("playb").style.visibility = "visible";
            document.getElementById("playb").value      = GuideText + "の説明";
        }
    };

    console.log( "end" );

    // Postするデータの作成
    data = "voicetext=" + guidestr;

    xhr.send( data );
};

////////////////////////////////////////////////
// 保存された再生
////////////////////////////////////////////////
function playOnClick(){
    audio.play();
    console.log( "play" );
};

////////////////////////////////////////////////
// GPSの状態表示
////////////////////////////////////////////////
function GpsOnClick(){
    if( GPSFlg ){
        // GPS Offにする
        GPSFlg = false;
        document.getElementById("gpsb").value      = "GPS ON";
    }else{
        // GPS Onにする
        GPSFlg = true;
        document.getElementById("gpsb").value      = "GPS OFF";
        ymap.panTo(new Y.LatLng( lastlat , lastlng ), true);
    }
    
    console.log( GPSFlg );
};

////////////////////////////////////////////////
// 初期地点に移動
////////////////////////////////////////////////
function NumazuOnClick(){
    ymap.drawMap(new Y.LatLng( startlat, startlng), 17, Y.LayerSetId.NORMAL);
    console.log( "start pos" );
};

///////////////////////////
// 距離の計算
// 返り値は 1.0 = 1km
///////////////////////////
function getDistance(lat1, lng1, lat2, lng2) {

   function radians(deg){
      return deg * Math.PI / 180;
   }

   return 6378.14 * Math.acos(Math.cos(radians(lat1))* 
    Math.cos(radians(lat2))*
    Math.cos(radians(lng2)-radians(lng1))+
    Math.sin(radians(lat1))*
    Math.sin(radians(lat2)));
};

///////////////////////////////
// 成功した時の関数
///////////////////////////////
function successFunc( position )
{
    //console.log( "lat" + position.coords.latitude );
    //console.log( "lng" + position.coords.longitude );
    
    // GPSの最終ポイントをセーブしておく
    lastlat = position.coords.latitude;
    lastlng = position.coords.longitude;
    // データの更新
	++syncerWatchPosition.count;					// 処理回数
	var nowTime = ~~( new Date() / 1000 );	        // UNIX Timestamp

	// 前回の書き出しから3秒以上経過していたら描写
	if( (syncerWatchPosition.lastTime + 3) > nowTime )
	{
		return false ;
	}
    
	// 前回の時間を更新
	syncerWatchPosition.lastTime = nowTime ;

    // GPSモードであれば、YahooMapの移動
    if( GPSFlg ){
        ymap.panTo(new Y.LatLng( position.coords.latitude , position.coords.longitude ), true);
    }
}

//////////////////////////////
// 失敗した時の関数
//////////////////////////////
function errorFunc( error )
{
	// エラーコードのメッセージを定義
	var errorMessage = {
		0: "原因不明のエラー発生" ,
		1: "位置情報の取得が未許可です" ,
		2: "電波状況等で位置情報が取得不可" ,
		3: "位置情報の取得がタイムアウト" ,
	} ;

	// エラーコードに合わせたエラー内容を表示
	alert( errorMessage[error.code] ) ;
}

///////////////////////////////////
// オプション・オブジェクト
///////////////////////////////////
var optionObj = {
	"enableHighAccuracy": false ,
	"timeout": 1000000 ,
	"maximumAge": 0 ,
} ;

// 現在位置を取得する
navigator.geolocation.watchPosition( successFunc , errorFunc , optionObj ) ;

