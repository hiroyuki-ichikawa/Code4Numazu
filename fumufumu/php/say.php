<?php
	// ガイダンス用の音声ファイルは、このphpの保管しているディレクトリに
	// soundというディレクトリを作成し、ファイルをアップロードしてください。


	// 要求されるファイル名の作成
	// JSONのid番号に合わせたファイル名を要求する。 
    $filename = "sound/" . htmlspecialchars($_POST['voicetext']) . ".mp3";

    // 
    $fp = fopen( $filename, "rb");
    $data = fread($fp, filesize($filename));

    // mp3形式で出力
    header('HTTP/1.1 200 OK');
    header('Content-Type: audio/mpeg'); 
    echo $data;

    fclose($fp);

?>