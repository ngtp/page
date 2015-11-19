<?php
require_once('Netcarver/Textile/DataBag.php');
require_once('Netcarver/Textile/Tag.php');
require_once('Netcarver/Textile/Parser.php');
use Netcarver\Textile\Parser as Textile;

$c = "";

if(isset($_REQUEST['c']))
    $c = $_REQUEST['c'];
if(isset($_POST['c']))
    $c = $_POST['c'];

$textile = new Textile();



echo $textile->textileThis($c);
?>