//Hex string to array
function str2Arr(str) {
	var arr = new Array(str.length/2);
	for (var i=0;i<str.length/2;i++)
		arr[i] = parseInt(str.substring(i*2, i*2+2), 16);
	return arr;
}

//Array to hex string
function arr2Str(arr) {
	var str = "";
	for (var i=0;i<arr.length;i++)
	{
		if (arr[i] < 16)
			str += "0";
		str += arr[i].toString(16);
	}
	return str;
}

//Upload and encrypt
function upload()
{
	var files = $("#file")[0].files;
	var key = $("#key").val();
	var iv = new Array(16);
	for (var i=0;i<16;i++)
		iv[i] = Math.floor(Math.random() * 256);
	
	if (key.length != 32)
	{
		$("#error").html("Invalid key! Scan your key first.");
		return;
	}
	key = str2Arr(key);
	
	if (files.length == 0)
	{
		$("#error").html("No file selected!");
		return;
	}
	var file = files[0];
	var fileName = file.name;
	var fileSize = file.size;
	var fileReader = new FileReader();
	var binary;
	fileReader.onload = function() {
		//Read file as array
		binary = Array.from(new Uint8Array(event.target.result));
		
		//Pad 0 and store padding length in IV
		iv[0] = 0;
		while (binary.length % 16 != 0) {
			binary.push(0);
			iv[0] += 17;
		}
		
		//Encrypt and transform into string
		var encryptBin = AESencrypt(binary, key, iv);
		var encryptStr = "";
		for (var i=0;i<encryptBin.length;i++)
			encryptStr += String.fromCharCode(encryptBin[i]);
		
		$.post("upload.php", {
			name: fileName,
			size: fileSize,
			iv: arr2Str(iv),
			data: window.btoa(encryptStr)
		}, function(data) {
			$("#keyinfo").html(data);
		});
	}
	fileReader.readAsArrayBuffer(file);
}

//Download and decrypt
function download(filename) {
	var key = $("#key").val();
	
	if (key.length != 32)
	{
		$("#error").html("Invalid key! Scan your key first.");
		return;
	}
	key = str2Arr(key);
	
	$.post("download.php", {
		name: filename
	}, function(data) {
		data = window.atob(data);
		
		//Extract IV
		var iv = str2Arr(data.substring(0, 32));
		var encryptStr = data.substring(32);
		
		//Read cipher as array
		var encryptBin = new Array(encryptStr.length);
		for (var i=0;i<encryptStr.length;i++)
			encryptBin[i] = encryptStr.charCodeAt(i);

		//Decrypt and discard extra 0
		var binary = AESdecrypt(encryptBin, key, iv);
		var file = new Uint8Array(binary.length - iv[0] / 17);
		for (var i=0;i<file.length;i++)
			file[i] = binary[i];
		
		//Prepare file for download
		var fileBlob = new Blob([new DataView(file.buffer)], {type: "application/octet-binary"});
		var fileUrl = URL.createObjectURL(fileBlob);
		
		//Download
		var a = document.createElement("a");
		document.body.appendChild(a);
		a.style = "display: none";
		a.href = fileUrl;
		a.download = filename;
		a.click();
		window.URL.revokeObjectURL(fileUrl);
	});
}

//Key generator
function entropy(event) {
	var key = $("#genkey");
	if (key.val().length >= 32) {
		if (!$("#entropy").attr("title"))
			new QRCode($("#entropy")[0], "PORTAL1-" + key.val().substring(0, 32));
		return;
	}
	if (Math.floor(event.timeStamp) % 31 == 0)
		key.val(key.val() + arr2Str([event.clientX]));
	else if (Math.floor(event.timeStamp) % 31 == 1)
		key.val(key.val() + arr2Str([event.clientY]));
}

function entropyOn() {
	$("#entropy").mousemove(entropy);
}

function entropyOff() {
	$("#entropy").off("mousemove");
}

//Generate a 1024-bit RSA key, with e=65537
function genRSA() {
	if ($("#genrsa").attr("title"))
		return;
	var key = RSAGenerate(1024, "65537");
	var keyStr = "(" + key.N.toString() + "," + key.d.toString() + ")";
	new QRCode($("#genrsa")[0], "PORTAL2-" + keyStr);
}

//Key scanner
function scan() {
	var video = $("#scanner")[0];
	var canvas = $("#qr-canvas")[0];
	var key = $("#key");
	var keyinfo = $("#keyinfo");
	var error = $("#error");
	error.html("Scanning... Try again?");
	if (video.src) {
		canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
		qrcode.callback = function(data) {
			if (data.indexOf("PORTAL1-") == 0) {
				key.val(data.substring(8, 40));
				keyinfo.html("Found key: (AES) " + data.substring(8, 16) + "...");
				error.html(" ");
			}
			else
				error.html("Invalid key");
		};
		qrcode.decode();
	}
}