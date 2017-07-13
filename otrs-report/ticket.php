<?php ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL); ?>
 <?php include("dbcon.php"); ?>
 <?php include("functions.php"); ?>

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
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



<h1> OTRS Ticket Report</h1>
<div id="header">
<h1> Ticket History # <?php echo $_GET["ticket"]; ?> </h1> </div>
<div id="container">	 
<div id="content" style="margin:20px auto; text-align: center;"> 
<?php 
$sql="Select config from dynamic_field where name='ticketarticle'";
$result=mysql_query($sql,$connection); 
$row=mysql_fetch_array($result);

$new=get_string_between($row[0],"PossibleValues:","TranslatableValues:");
$new=(preg_replace("/\'[0-9]\'|\'[0-9][0-9]\'/","",$new));
$new=explode(":",$new);
unset($new[0]);

sort($new); 



  function get_string_between_new($string, $start, $end){
    $string = ' ' . $string;
    $ini = strpos($string, $start);
    if ($ini == 0) return '';
    $ini += strlen($start);
    $len = strpos($string, $end, $ini) - $ini;
    return substr($string, $ini, $len);
}

$finalsub=array();

$sqlsub="Select config from dynamic_field where name='SubNote'";
$resultsub=mysql_query($sqlsub,$connection);
$rowsub=mysql_fetch_array($resultsub);
$newsub=get_string_between_new($rowsub[0],"PossibleValues:","TranslatableValues:");
$newsub=explode("\n", $newsub);
unset($newsub[0]);
unset($newsub[sizeof($newsub)]);

foreach ($newsub as $key => $id){
	//print_r($newsub[$key]);
	$stringsub=explode(":", $newsub[$key]);
	
$stringsub1=str_replace("'","",$stringsub[0]);
$stringsub1=str_replace(" ","",$stringsub1);

$finalsub[$stringsub1]=$stringsub[1];}?>

<pre>
<?php //print_r($finalsub); ?>
</pre>


<?php

	//print_r($new);
echo "</br>";
$sql1="Select config from dynamic_field where name='noteticket'";
$result1=mysql_query($sql1,$connection); 
$row1=mysql_fetch_array($result1);

$new1=get_string_between($row1[0],"PossibleValues:","TranslatableValues:");
$new1=(preg_replace("/\'[0-9]\'/","",$new1));
$new1=explode(":",$new1);
unset($new1[0]);
//print_r($new1);

?>
<div id="wrap">
<table width="100%" style="border-collapse: collapse;">
<tr>
	<th>Ticket Name</th>
	<th>Updates</th>
	<th>Note</th>

	<th>Subject</th>
	<th>Date</th>
	<th>Status</th>
	<th> updated By </th>
</tr>

<?php 
$sql="Select ticket.title from ticket where ticket.id=".$_GET["ticket"];
$sql1="Select count(distinct article.a_subject)from article where article.ticket_id=".$_GET["ticket"];
$table1=mysql_query($sql,$connection);
$rowtable1=mysql_fetch_array($table1);
$table2=mysql_query($sql1,$connection);
$rowtable2=mysql_fetch_array($table2);

$sql2="select dynamic_field_value.value_text ,ticket.create_time,ticket_state.name as State from ticket INNER JOIN dynamic_field_value ON dynamic_field_value.object_id=ticket.id INNER JOIN ticket_state ON ticket.ticket_state_id = ticket_state.id where ticket.id='".$_GET["ticket"]."'";
//echo $sql2."</br>";
$table3=mysql_query($sql2,$connection);


?>

<tr>
<td rowspan="<?php echo $rowtable2[0]; ?>" > <?php echo get_string_between($rowtable1[0],":",":"); ?></td>
<td> <?php while($rowtable3=mysql_fetch_array($table3)) {echo $new1[$rowtable3[mysql_field_name($table3, 0)]];?> </td>
<td>-</td>
<td>-</td>
<td><?php   echo $rowtable3[mysql_field_name($table3,1)]; ?> </td>
<td>New</td> <?php } ?>

 </tr>



<?php

$sqlArticle="SELECT
dynamic_field_value.value_text,
(select value_text from dynamic_field_value where object_id=article.id and field_id='10') as test1,
article.a_subject,
article.change_time,
ticket_state.`name`, users.`login` 
from article LEFT JOIN ticket ON ticket.id=article.ticket_id 
LEFT JOIN dynamic_field_value ON dynamic_field_value.object_id=article.id
LEFT JOIN ticket_history ON ticket_history.article_id = article.id
LEFT JOIN users ON article.change_by=users.id
LEFT JOIN ticket_state ON ticket_history.state_id = ticket_state.id where article.ticket_id=".$_GET["ticket"]." group by article.a_subject order by article.change_time";

//echo $sql3;
$table5=mysql_query($sqlArticle,$connection);
//$rowtable4=mysql_fetch_assoc($table4);
?>
<pre>
<?php  //print_r($rowtable5=mysql_fetch_array($table5)); ?>
</pre>
<?php
$rowtable5=mysql_fetch_array($table5);
while($rowtable5=mysql_fetch_array($table5)){
	
 ?>
 <tr>	
	<td> <?php if(isset($new[$rowtable5[mysql_field_name( $table5, 0)]])){ echo $new[$rowtable5[mysql_field_name( $table5, 0)]-1]; }?> </td><td>
	<?php if(isset($finalsub[$rowtable5[mysql_field_name( $table5, 1)]])){echo $finalsub[$rowtable5[mysql_field_name( $table5, 1)]];} else {echo "";} ?> </td>  <?php
for($i=2;$i<mysql_num_fields($table5);$i++){
?>
<td> <?php if($rowtable5[mysql_field_name( $table5, $i)]) {echo $rowtable5[mysql_field_name( $table5, $i)]; }?> </td> <?php }
}

 ?>
</table>
</div>

</div>
</div>
</body>
</html>