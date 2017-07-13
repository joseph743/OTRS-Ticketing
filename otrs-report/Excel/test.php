<?php

//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);
include('ExcelService.class.php');


//require_once('tcpdf_include.php');
include("../functions.php");

$host="localhost";
$username="root";
$password="P@ssw0rd!";
$db_name="otrs";


$connection=mysql_connect("$host", "$username", "$password")or die("cannot connect to server");
mysql_select_db("$db_name")or die("cannot select db"); 
 
 
  function get_string_between_new($string, $start, $end){
    $string = ' ' . $string;
    $ini = strpos($string, $start);
    if ($ini == 0) return '';
    $ini += strlen($start);
    $len = strpos($string, $end, $ini) - $ini;
    return substr($string, $ini, $len);
}



  if($_GET["problem_type"]!="G"){
$sql = "SELECT ticket.id as id, ticket.title as title ,queue.name as name , ticket.create_time as tickettime FROM ticket INNER JOIN article on article.ticket_id=ticket.id  INNER JOIN dynamic_field_value on dynamic_field_value.object_id=article.id INNER JOIN users ON ticket.user_id = users.id INNER JOIN queue ON ticket.queue_id=queue.id INNER JOIN ticket_state ON ticket.ticket_state_id = ticket_state.id WHERE ticket.ticket_state_id<>9 and dynamic_field_value.value_text =".$_GET["problem_type"]." AND ticket.title LIKE '%".$_GET["Link"]."%' and ticket_state.name Like '%".$_GET["State"]."%' and users.login LIKE '%".$_GET['Owner']."%' and queue.name LIKE '%".$_GET['Customer']."%'";

  }
   else{
	   
	 $sql = "SELECT ticket.id as id, ticket.title as title ,queue.name as name , ticket.create_time as tickettime FROM ticket INNER JOIN users ON ticket.user_id = users.id INNER JOIN queue ON ticket.queue_id=queue.id INNER JOIN ticket_state ON ticket.ticket_state_id = ticket_state.id WHERE ticket.ticket_state_id<>9 and ticket.title LIKE '%".$_GET["Link"]."%' and ticket_state.name Like '%".$_GET["State"]."%' and users.login LIKE '%".$_GET['Owner']."%' and queue.name LIKE '%".$_GET['Customer']."%'";
  
   }
   

	//$sql.="WHERE ticket.title LIKE '%".$_GET['Link']."%' and ticket_state.name Like '%".$_GET["State"]."%' and users.login LIKE '%".$_GET['Owner']."%' and queue.name LIKE '%".$_GET['Customer']."%'";
	
	
if(isset($_GET['Created']))
	if($_GET['Modified']!=""){
	$sql.=" AND ticket.create_time >= '".$_GET['Created']."' AND ticket.change_time <='".$_GET['Modified']."'";
}else{$sql.=" AND ticket.create_time>='".$_GET['Created']."' ";} 
	
	
	//echo $sql;
//$pdf->Write(0, $sql, '', 0, 'L', true, 0, false, false, 0);
	
$table=mysql_query($sql,$connection);

//$rows123=mysql_fetch_array($table);
$tbl1='
<table border="1" cellspacing="1" cellpading="1">
	<tr align="center">
		<th   width="210px" bgcolor="#0080ff"> Problem </th>
		<th bgcolor="#0080ff"> Updates </th>
		<th bgcolor="#0080ff"> Note </th>
		<th bgcolor="#0080ff"> Subject </th>
		<th bgcolor="#0080ff"> Date </th>
		<th bgcolor="#0080ff"> Status </th>
		<th bgcolor="#0080ff"> Updated By</th>
	</tr>';
//$pdf->Write(0, $sql, '', 0, 'L', true, 0, false, false, 0);

$sqlt="Select config from dynamic_field where name='ticketarticle'";
$resultt=mysql_query($sqlt,$connection); 
$rowt=mysql_fetch_array($resultt);
$newt=get_string_between_new($rowt[0],"PossibleValues:","TranslatableValues:");
$newt=(preg_replace("/\'[0-9]\'|\'[0-9][0-9]\'/","",$newt));
$newt=explode(":",$newt);
//unset($newt[0]);

sort($newt); 
//print_r($newt);

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

$finalsub[$stringsub1]=$stringsub[1];}
$tbl2='';	
while($rows=mysql_fetch_array($table)){
	
	//$pdf->Write(0, $rows[2], '', 0, 'L', true, 0, false, false, 0);
	//$sql="Select ticket.title as title, queue.name as name from ticket INNER JOIN queue ON ticket.queue_id = queue.id where ticket.id=".$rows[id];

//$tableid=mysql_query($sql,$connection);
//$rowtableid=mysql_fetch_array($table1);
//$pdf->Write(0, $sql, '', 0, 'L', true, 0, false, false, 0);
//$table2=mysql_query($sql1,$connection);
//$rowtable2=mysql_fetch_array($table2);
//$pdf->Write(0, $table2, '', 0, 'L', true, 0, false, false, 0);
//$sql2="select dynamic_field_value.value_text ,ticket.create_time,ticket_state.name as State from ticket INNER JOIN dynamic_field_value ON dynamic_field_value.object_id=ticket.id INNER JOIN ticket_state ON ticket.ticket_state_id = ticket_state.id where ticket.id=".$rows[id];
//echo $sql2."</br>";
//$table3=mysql_query($sql2,$connection);
//while($rowtable3=mysql_fetch_array($table3)){
//$pdf->Write(0, "\n", '', 0, 'L', true, 0, false, false, 0);
//if(get_string_between($rowtable1[name], '::','::') == "GDS VIP Customers"){
//$pdf->Write(0, get_string_between($rowtable1[title],'-',':'), '', 0, 'L', true, 0, false, false, 0);

//}
//else {$pdf->Write(0, get_string_between($rowtable1[title],':',':'), '', 0, 'L', true, 0, false, false, 0);}



//$pdf->Write(0, $newt, '', 0, 'L', true, 0, false, false, 0);

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
LEFT JOIN ticket_state ON ticket_history.state_id = ticket_state.id where article.ticket_id=".$rows[0]." group by article.a_subject order by article.change_time";

$sql1="Select count(distinct article.a_subject) as count from article where article.ticket_id=".$rows[0];
$table1=mysql_query($sql1,$connection);
$rowtable1=mysql_fetch_array($table1);
$table5=mysql_query($sqlArticle,$connection);
//$rowtable4=mysql_fetch_assoc($table4);
//$rowtable5=mysql_fetch_array($table5);
	
	if(get_string_between_new($rows[2], "::","::") == "GDS VIP Customers"){
$test=get_string_between_new($rows[1],"-",":");

}
else{ $test=get_string_between_new($rows[1],":",":");}


$nb=$rowtable1[0];
$tbl1.='
	
	<tr align="center">
	<td align="" height="70px" width="210px" rowspan="'.$nb.'">';
	
	
	
	$tbl1.=$test.'</td>
	<td>case opened</td>
	<td>-</td>
	<td>-</td>
	<td>'.$rows[3].'</td>
	<td>New</td>
	<td>-</td>
	
	

	</tr>';
	$rowtable5=mysql_fetch_array($table5);

while($rowtable5=mysql_fetch_array($table5)){	

$gg=$rowtable5[2];


if(strpos(get_string_between_new($rowtable5[2], ":",":"),"Link"))
			{
					$gg=get_string_between_new($rowtable5[2],"-",":");

			}
else 
		{
			if(strpos(get_string_between_new($rowtable5[2], ":",":"),"EIGRP")==true)
					{ $gg=get_string_between_new($rowtable5[2],":",":");}
		}



	$tbl1.='<tr align="center">';
	$tbl1.='<td>'.$newt[$rowtable5[0]].'</td>
	<td>'.$finalsub[$rowtable5[1]].'</td>
	<td>'.$gg.'</td>
	<td>'.$rowtable5[3].'</td>
	<td>'.$rowtable5[4].'</td>
	<td>'.$rowtable5[5].'</td>
	</tr>';
	
}
	
//$pdf->writeHTML("<BR>", true, fale, false, false, '');	
	
$tbl1.='<tr height="30px"><td colspan="7" bgcolor="#0080ff"> </td></tr>'; 
	

}
	
$tbl2.=$tbl1;	


echo $tbl2;
$tbl3='<html><body><br/><br/><br/><br/><br/><br/><br/><br/>'.$tbl2.'</body></html>';
$excgs= new ExcelService();


$test=$excgs->generateExcel($tbl3);

//$excgs->downloadFile($test);
$link="http://192.168.13.54/otrs-report/Excel/temp/".$test; ?>
<a href="<?php echo $link; ?>"><button> Download </button></a>

<?php echo "";?>
