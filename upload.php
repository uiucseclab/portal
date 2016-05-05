<?php
$name = $_POST["name"];
$size = $_POST["size"];
$iv = $_POST["iv"];
$data = $_POST["data"];

$handle = fopen("storage/$name", "x");
if (!$handle)
	die("File exists!");
fwrite($handle, $iv);
fwrite($handle, base64_decode($data));
fclose($handle);

echo "Upload success!";
