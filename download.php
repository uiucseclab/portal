<?php
$name = $_POST["name"];

echo base64_encode(file_get_contents("storage/$name"));