<?php ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL); ?>
 <?php include("dbcon.php"); ?>
 <?php include("functions.php"); ?>

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
  <script src="http://cdn.jsdelivr.net/webshim/1.12.4/extras/modernizr-custom.js"></script>
<!-- polyfiller file to detect and load polyfills -->
<script src="http://cdn.jsdelivr.net/webshim/1.12.4/polyfiller.js"></script>
<script>
  webshims.setOptions('waitReady', false);
  webshims.setOptions('forms-ext', {types: 'date'});
  webshims.polyfill('forms forms-ext');
</script>
<script>

$(document).ready(function() {
  $("#btnExport").click(function(e) {
    e.preventDefault();

    //getting data from our table
    var data_type = 'data:application/vnd.ms-excel';
    var table_div = document.getElementById('wrap');
    var table_html = table_div.outerHTML.replace(/ /g, '%20');

    var a = document.createElement('a');
    a.href = data_type + ', ' + table_html;
    a.download = 'report' + Math.floor((Math.random() * 9999999) + 1000000) + '.xls';
    a.click();
  });
});
</script>
<title>OTRS Ticket Report</title>
<link rel="stylesheet" type="text/css" href="my.css">

 
</head>
<body>
<?php

$sqlqueue="select name from queue where name LIKE '%ManagedService::%'";
$resultqueue=mysql_query($sqlqueue,$connection);



$sql="Select config from dynamic_field where name='ticketarticle'";
$result=mysql_query($sql,$connection); 
$row=mysql_fetch_array($result);

$new=get_string_between($row[0],"PossibleValues:","TranslatableValues:");
$new=(preg_replace("/\'[0-9]\'|\'[0-9][0-9]\'/","",$new));
$new=explode(":",$new);
unset($new[0]);
unset($new[1]);
sort($new); 
 ?>

<h1> OTRS Ticket Report</h1>
<div id="container">
<div style="margin:20px auto; text-align: center;">
<form method="get" action="index.php">
</br>
<table>
<tr>
	<td>Link name: </td><td><input type="text" name="Link" id="string1" value= "<?php  if(isset($_GET["Link"])) {echo $_GET["Link"];}?>"></td>
	<td>Customer:</td> <td>
		<select name="Customer" ><option value="" selected>--All-- </option>
		<?php
			while($rowqueue=mysql_fetch_array($resultqueue)){
				$rowqueue["name"]=$rowqueue["name"]."@";
				if(get_string_between($rowqueue["name"],"::","::")=="GDS VIP Customers"){
				echo "<option value=".urlencode(get_string_between($rowqueue["name"], "GDS VIP Customers::","@"))."> ".urldecode(get_string_between($rowqueue["name"], "GDS VIP Customers::","@"))."</option>";}
				else{
				echo "<option value=".urlencode(get_string_between($rowqueue["name"], "ManagedService::","@"))."> ".urldecode(get_string_between($rowqueue["name"], "ManagedService::","@"))."</option>";
				}
				
			}
			?>
		</select>
		</td>
	<td>From:  </td><td><input type="date" name="Created" id="Created" value= "<?php if(isset($_GET["Created"])) {echo $_GET["Created"];} ?>"></td>

</tr>
<tr>
	<td>TO:  </td><td><input type="date" name="Modified" id="modified"  value="<?php if(isset($_GET["Modified"])) {echo $_GET["Modified"];} ?>"></td>
	<td>
		State:  </td><td>
		<select name="State"><option value="" selected>--All--</option>
		<?php 
			$sql="Select name from ticket_state";
			$result=mysql_query($sql,$connection);
			while($row=mysql_fetch_array($result))
			{
				echo "<option value=".urlencode($row["name"])."> ".urldecode($row["name"])."</option>";
			}
			
		?></select>
	</td>
	<td>Owner:  </td><td><select name="Owner" value= "<?php echo $_GET["Owner"]; ?>"><option  value="">--All--</option>
		<?php 
			$sql="Select login from users where valid_id=1";
			$result=mysql_query($sql,$connection);
			while($row=mysql_fetch_array($result))
			{
				echo "<option value=".$row["login"]."> ".$row["login"]."</option>";
			}
			
		?></select>
</tr>
<tr>
<td> Problem Type: </td> 
<td>  <select name="problem_type" > <option value="G" selected> --All-- </option><?php foreach ($new as $key => $value) {
 echo "<option value=".urlencode($key+2).">".urldecode($value)."</option>";
} ?> </select></td>


</tr>

<tr>
	<td colspan="6">  <input type="submit" name="Search" value="Search"></td></tr>
</table>

</form>
</div>      
<div id="content">
 
<p>Search results :</p>
<div id="wrap">
 <?php
 if (isset($_GET["Search"]))
 { 
  gettable("ticket");
}

 ?> 

</div>


 
</div>
<?php
$test="../otrs-report/Excel/test.php?";
$link1="http://192.168.13.54/otrs-report/TCPDF-master/examples/action.php";
$test1="../otrs-report/TCPDF-master/examples/Reports.php?";  
foreach($_GET as $query_string_variable => $value) {
   $test.="$query_string_variable=$value&";
   $test1.="$query_string_variable=$value&";
}
?>

<p align="center"><a href="<?php echo $test; ?>""><button> Export to Excel </button></a> |
<a href="<?php echo $test1; ?>""><button> Export to pdf </button></a> |
<a href="<?php echo $link1; ?>" ><button> List of actions taken  </button></a>	
</p>
</div> 



<?php include("footer.php"); ?>


