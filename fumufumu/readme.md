Name
「ふむふむ」　オープンデータを使った地域ごとの音声ガイダンスアプリ

Overview
　JSON形式で作成した地点データと、各地点のガイダンス音声（mp3）を
　Yahoo地図に表示し、簡単な音声ガイダンスシステムを構築します。
　GPSを利用したトレースモードと、地図上から確認するモードの２つを
　用意しています。

　Monacaを利用することで、Android/iOSの双方に対応することができます。

## 必要なシステム/データ
　・PHPが稼働しているサーバ
　・Monacaの開発環境
　・YahooのアプリケーションID
　・mp3（ガイダンス用）
　　音声データを自分で録音するか、観光案内用のテキストがある場合は
　　http://soundoftext.com/　を利用して音声を作成してください。
　　（あまり長い文章は変換できません。）

## ファイル構成、コードの中身を変更する箇所
　○monaca以下のファイルはmonacaの開発用ファイルです。
　　・www/index.html
　　　・（アプリケーションID）を変更します。

　　・www/fumufumu.js
　　　　・（各自のサイトを設定してください）の箇所をphpと音声（mp3）を設定した
　　　　　　サーバを設定してください
　　　　・グローバル変数を変更することで、各都市ごとに変更が可能です。

　　・www/json
　　　　・各地に合わせた地点データを作成し配置します。

　　・platforms/android/AndroidManifest.xml
　　　　・GPS許可済に設定してあります。

　○php以下のファイルはサーバ上に設置するファイルです。
　　・say.php
　　　サーバに設置します。
　　　say.php設置ディレクトリにsoundというディレクトリを作り
　　　作成した音声ファイルをアップロードしておきます。

## ガイド用の地点JSONの形式
　・キーと値の説明
　　　id　　　　　 : 地点のユニークなIDを設定します
　　　latitude　　: 緯度を設定します（WGS84）
　　　longitude　 : 経度を設定します（WGS84）
　　　kind　　　　 : 地点アイコンの色分けように数値を設定します
　　　name　　　　 : 地点の名称を設定します
　　　yomi　　　　 : 詳細な情報を設定します（未利用）
　　　link　　　　 : 地点アイコンをタッチした際に関連ページへリンクしたい場合に設定します


　・沼津の例：
　　[
  　　{"id":1,"latitude":"35.153672","longitude":"138.821940","kind":"0","name":"赤野観音堂","yomi":"江戸初期の建築様式の建物。お堂は左甚五郎が、わら人形に手伝わせ一夜で作った伝承あり。境内には、大カヤの木がある。","link":"http://www.city.numazu.shizuoka.jp/takara/kobetu/rekishi/067_akeno.htm"},
  　　{"id":2,"latitude":"35.130094","longitude":"138.892151","kind":"1","name":"鮎壺の滝","yomi":"ここで鮎が止められ滝壺に群れていたのが名前の由来。美貌の亀鶴という少女が身を投げたという伝説がある。","link":"http://www.city.numazu.shizuoka.jp/takara/kobetu/sizen/023_ayutubo.htm"},
　　]

　・kindを増やす場合には、images以下の画像を増やし、fumufumu.js内でicon配列と連携させてください。
　　初期設定は、下記のようになっています。
　　　kind = 0 ：　赤色
　　　kind = 1 ：　青色
　　　kind = 2 ：　黄色
　　　kind = 3 ：　紫色
　　　kind = 4 ：　緑色

## Licence
　MPLに従ったオープンソ−スとします。
　各地域、端末に合わせて改造、調整してください。

「さるぼぼ」ちゃんはどこかで利用していただけると嬉しいです。
　（必須ではありません）

## Author
　ご意見ご要望や、利用したいなどのお問い合わせは、下記よりご連絡ください。

　<市川電産>
　http://ichi-den.sakura.ne.jp/wp/

　<Code for Numazu>
　http://www.code4numazu.org/
