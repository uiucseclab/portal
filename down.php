<script>
//Scanner initialization
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

navigator.getUserMedia({video: true}, function(stream) {
	$("#scanner")[0].src = window.URL.createObjectURL(stream);
}, function(e){
	console.log(e);
});
</script>

<pre>
First, click on the video to scan your physical key.
Then, choose the file to download. You'll get it when it's decrypted!
</pre>

<div style="float: left;">
	<video id="scanner" onclick="scan()" style="width: 480px; height: 360px;" autoplay></video>
	<canvas id="qr-canvas" style="width: 2048px; height: 1536px; display: none"></canvas>
	<input id="key" type="text" style="display: none"><br>
	<span id="keyinfo">Click to scan!</span><br>
	<span id="error"></span><br>
</div>
<div style="float: left;">
	<?php
	echo '[FILE LIST]' . '<br>';
	$files = scandir("storage");
	for ($i=0; $i<count($files); $i++) {
		$filename = $files[$i];
		if ($filename == '.' || $filename == '..')
			continue;
		echo '<a href="javascript:download(\'' . $filename . '\')">' . $filename .'</a><br>';
	}
	?>
</div>