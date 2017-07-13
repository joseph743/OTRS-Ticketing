<?php
//============================================================+
// File name   : example_048.php
// Begin       : 2009-03-20
// Last Update : 2013-05-14
//
// Description : Example 048 for TCPDF class
//               HTML tables and table headers
//
// Author: Nicola Asuni
//
// (c) Copyright:
//               Nicola Asuni
//               Tecnick.com LTD
//               www.tecnick.com
//               info@tecnick.com
//============================================================+

/**
 * Creates an example PDF TEST document using TCPDF
 * @package com.tecnick.tcpdf
 * @abstract TCPDF - Example: HTML tables and table headers
 * @author Nicola Asuni
 * @since 2009-03-20
 */

// Include the main TCPDF library (search for installation path).

require_once('tcpdf_include.php');
include("functions.php");

$host="localhost";
$username="root";
$password="P@ssw0rd!";
$db_name="otrs";


$connection=mysql_connect("$host", "$username", "$password")or die("cannot connect to server");
mysql_select_db("$db_name")or die("cannot select db"); 
 

 function get_string_between($string, $start, $end){
    $string = ' ' . $string;
    $ini = strpos($string, $start);
    if ($ini == 0) return '';
    $ini += strlen($start);
    $len = strpos($string, $end, $ini) - $ini;
    return substr($string, $ini, $len);
}

//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);
// create new PDF document
$height      = 380;
$width         = 580; 
$pageLayout     = array($height, $width);
$pdf            = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, $pageLayout, true, 'UTF-8', false);
//$width = 175;  
//$height = 266; 
//$orientation = ($height>$width) ? 'P' : 'L';  
//$pdf->addFormat("custom", $width, $height);  
//$pdf->reFormat("custom", $orientation);  
$custname="Tickets Report";
// set document information
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('Proactive Team');
$pdf->SetTitle('Report OTRS');
$pdf->SetSubject('TCPDF Tutorial');
$pdf->SetKeywords('TCPDF, PDF, example, test, guide');

// set default header data
if(isset($_GET[Customer])){
	
$pdf->SetHeaderData(PDF_HEADER_LOGO, 50, ''.$_GET[Customer].'', 'Links report');
}else {
	
	$pdf->SetHeaderData(PDF_HEADER_LOGO, 50, ''.$custname.'', 'General issue Weekly Report');
}

// set header and footer fonts
$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

// set default monospaced font
$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

// set margins
$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

// set auto page breaks
$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

// set image scale factor
$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

// set some language-dependent strings (optional)
if (@file_exists(dirname(__FILE__).'/lang/eng.php')) {
	require_once(dirname(__FILE__).'/lang/eng.php');
	$pdf->setLanguageArray($l);
}

// ---------------------------------------------------------
$pdf->setFontSubsetting(false);
// set font
$pdf->SetFont('helvetica', 'B', 24);

// add a page
$pdf->AddPage();
$pdf->writeHTML('<br>', true, false, false, false, '');	
$pdf->Write(0, 'OTRS Statistics:', '', 0, 'L', true, 0, false, false, 0);

$pdf->writeHTML('<br>', true, false, false, false, '');
$pdf->SetFont('helvetica', '', 8);


$pdf->setFormDefaultProp(array('lineWidth'=>1, 'borderStyle'=>'solid', 'fillColor'=>array(255, 255, 200), 'strokeColor'=>array(255, 128, 128)));

$date = date('Y-m-d'); 

//$pdf->Write(0, $date, '', 0, 'L', true, 0, false, false, 0);
$oneWeekAgo = strtotime ( '-1 week' , strtotime ( $date ) ) ; 

$pdf->Write(0, date('Y-m-d ',$oneWeekAgo), '', 0, 'L', true, 0, false, false, 0);
//$pdf->Write(0, date('Y-m-d H:i:s',$oneWeekAgo), '', 0, 'L', true, 0, false, false, 0);
$sqlt="Select config from dynamic_field where name='ticketarticle'";
$resultt=mysql_query($sqlt,$connection); 
$rowt=mysql_fetch_array($resultt);
$newt=get_string_between($rowt[0],"PossibleValues:","TranslatableValues:");
$newt=(preg_replace("/\'[0-9]\'|\'[0-9][0-9]\'/","",$newt));
$newt=explode(":",$newt);
//unset($newt[0]);



sort($newt); 

//print_r($newt);

$finalsub=array();

$sqlsub="Select config from dynamic_field where name='SubNote'";
$resultsub=mysql_query($sqlsub,$connection);
$rowsub=mysql_fetch_array($resultsub);
$newsub=get_string_between($rowsub[0],"PossibleValues:","TranslatableValues:");
$newsub=explode("\n", $newsub);
unset($newsub[0]);
unset($newsub[sizeof($newsub)]);

foreach ($newsub as $key => $id){
	//print_r($newsub[$key]);
	$stringsub=explode(":", $newsub[$key]);
	
$stringsub1=str_replace("'","",$stringsub[0]);
$stringsub1=str_replace(" ","",$stringsub1);

$finalsub[$stringsub1]=$stringsub[1];}





$pdf->SetFont('helvetica', 'B', 17);
$pdf->writeHTML("Total Number of cases per General problem:<br/>", true, false, false, false, '');	
//print_r($finalsub);

// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------

//Close and output PDF document



$que="SELECT
	value_text,
	article.create_time,
	ticket.tn AS test3,count(*) as total,
	(
		SELECT
			count(*) as test0
		FROM
			article
		INNER JOIN ticket ON ticket.tn = article.a_body
		WHERE
			ticket.tn =test3
	) as subtotal,
	(
		SELECT
			value_text
		FROM
			dynamic_field_value
		WHERE
			object_id = article.id
		AND field_id = '9'
	) AS test0
FROM
	dynamic_field_value
INNER JOIN article ON article.id = dynamic_field_value.object_id
INNER JOIN ticket ON ticket.id = article.ticket_id
WHERE
	value_text >= 10000
AND value_text < 20000
AND article.create_time>='".date('Y-m-d',$oneWeekAgo)."'
GROUP BY
	value_text,
	ticket.tn";
	
	


$queq=mysql_query($que,$connection);

$associativeArray = array();
while($quep=mysql_fetch_array($queq)){
	
	$associativeArray[$quep[0]]+=$quep[3]+$quep[4];
}



$BSql="select value_text,article.create_time,count(*),(select value_text from dynamic_field_value where object_id=article.id and field_id='9') as test1 from dynamic_field_value 

inner join article on article.id=dynamic_field_value.object_id

where value_text >=10000 and value_text <20000 and article.create_time>='".date('Y-m-d',$oneWeekAgo)."' group by value_text ";
$resultql=mysql_query($BSql,$connection);



$table='<style> td{height: 20px; text-align:center; vertical-align:middle;}</style>
<table border="1" cellspacing="1" cellpading="1">
			<tr align="center">
				<th bgcolor="#0080ff"> Problem Type</th>
				<th bgcolor="#0080ff"> Base Station  </th>
				<th bgcolor="#0080ff"> Date </th>
				<th bgcolor="#0080ff"> Number of tickets </th>
			</tr>';
			
			$newql=mysql_fetch_array($resultql);
	$table.='<tr><td rowspan="'.mysql_num_rows($resultql).'" align="center"> Base Station </td>
	<td>'.$finalsub[$newql[0]].'</td>
	<td> '.$newql[1].' </td>
	<td> '.$associativeArray[$newql[0]].' </td>
	</tr>';
while($newql=mysql_fetch_array($resultql)){
	$table.='
<tr>
	<td> '.$finalsub[$newql[0]].' </td>
	<td> '.$newql[1].' </td>
	<td> '.$associativeArray[$newql[0]].' </td>
	</tr>
	
	
	';
	
}
//

$table.='</table>';



$pdf->SetFont('helvetica','',12);
$pdf->writeHTML($table, true, false, false, false, '');	







$que1="SELECT
	value_text,
	article.create_time,
	ticket.tn AS test3,count(*) as total,
	(
		SELECT
			count(*) as test0
		FROM
			article
		INNER JOIN ticket ON ticket.tn = article.a_body
		WHERE
			ticket.tn =test3
	) as subtotal,
	(
		SELECT
			value_text
		FROM
			dynamic_field_value
		WHERE
			object_id = article.id
		AND field_id = '9'
	) AS test0
FROM
	dynamic_field_value
INNER JOIN article ON article.id = dynamic_field_value.object_id
INNER JOIN ticket ON ticket.id = article.ticket_id
WHERE
	value_text >= 20000
AND value_text < 30000
AND article.create_time>='".date('Y-m-d',$oneWeekAgo)."'
GROUP BY
	value_text,
	ticket.tn";
	


$queq1=mysql_query($que1,$connection);

$associativeArray1 = array();
while($quep1=mysql_fetch_array($queq1)){
	
	$associativeArray1[$quep1[0]]+=$quep1[3]+$quep1[4];
}









$BSql1="select value_text,article.create_time,count(*),(select value_text from dynamic_field_value where object_id=article.id and field_id='9') as test1 from dynamic_field_value 

inner join article on article.id=dynamic_field_value.object_id

where value_text >=20000 and value_text <30000 and article.create_time>='".date('Y-m-d',$oneWeekAgo)."' group by value_text ";



$resultql1=mysql_query($BSql1,$connection);



$table1='<style> td{height: 20px; text-align:center; vertical-align:middle;}</style>
<table border="1" cellspacing="1" cellpading="1">
			<tr align="center">
				<th bgcolor="#0080ff"> Problem Type</th>
				<th bgcolor="#0080ff"> Transmission issue  </th>
				<th bgcolor="#0080ff"> Date </th>
				<th bgcolor="#0080ff"> Number of tickets </th>
			</tr>';
			
			$newql1=mysql_fetch_array($resultql1);
	$table1.='<tr><td rowspan="'.mysql_num_rows($resultql1).'" align="center"> Transmission issue </td>
	<td>'.$finalsub[$newql1[0]].' </td>
	<td> '.$newql1[1].' </td>
	<td> '.$associativeArray1[$newql1[0]].' </td>
	</tr>';
while($newql1=mysql_fetch_array($resultql1)){
	$table1.='
<tr>
	<td>'.$finalsub[$newql1[0]].' </td>
	<td> '.$newql1[1].' </td>
	<td> '.$associativeArray1[$newql1[0]].' </td>
	</tr>
	
	
	';
	
}
//

$table1.='</table>';
$pdf->SetFontSize(12,true);
$pdf->writeHTML($table1, true, false, false, false, '');






$que2="SELECT
	value_text,
	article.create_time,
	ticket.tn AS test3,count(*) as total,
	(
		SELECT
			count(*) as test0
		FROM
			article
		INNER JOIN ticket ON ticket.tn = article.a_body
		WHERE
			ticket.tn =test3
	) as subtotal,
	(
		SELECT
			value_text
		FROM
			dynamic_field_value
		WHERE
			object_id = article.id
		AND field_id = '9'
	) AS test0
FROM
	dynamic_field_value
INNER JOIN article ON article.id = dynamic_field_value.object_id
INNER JOIN ticket ON ticket.id = article.ticket_id
WHERE
	value_text >= 30000
AND value_text < 40000
AND article.create_time>='".date('Y-m-d',$oneWeekAgo)."'
GROUP BY
	value_text,
	ticket.tn";
	


$queq2=mysql_query($que2,$connection);

$associativeArray2 = array();
while($quep2=mysql_fetch_array($queq2)){
	
	$associativeArray2[$quep2[0]]+=$quep2[3]+$quep2[4];
}




$BSql2="select value_text,article.create_time, count(*),(select value_text from dynamic_field_value where object_id=article.id and field_id='9') as test1 from dynamic_field_value 

inner join article on article.id=dynamic_field_value.object_id

where value_text >=30000 and value_text <40000 and article.create_time>='".date('Y-m-d',$oneWeekAgo)."'  group by value_text ";

$resultql2=mysql_query($BSql2,$connection);



$table2='<style> td{height: 20px; text-align:center;}</style>
<table border="1" cellspacing="1" cellpading="1">
			<tr align="center">
				<th bgcolor="#0080ff"> Problem Type</th>
				<th bgcolor="#0080ff"> DSL issue  </th>
				<th bgcolor="#0080ff"> Date </th>
				<th bgcolor="#0080ff"> Number of tickets </th>
			</tr>';
			
			$newql2=mysql_fetch_array($resultql2);
	$table2.='<tr><td rowspan="'.mysql_num_rows($resultql2).'" align="center"> DSL Problem </td>
	<td>'.$finalsub[$newql2[0]].' </td>
	<td>'.$newql2[1].' </td>
	<td>'.$associativeArray2[$newql2[0]].' </td>
	</tr>';
while($newql2=mysql_fetch_array($resultql2)){
	$table2.='
<tr>
	<td>'.$finalsub[$newql2[0]].' </td>
	<td> '.$newql2[1].' </td>
	<td> '.$associativeArray2[$newql2[0]].' </td>
	</tr>
	
	
	';
	
}
//

$table2.='</table>';


$pdf->SetFontSize(12,true);
$pdf->writeHTML($table2, true, false, false, false, '');

	
	
	


$BSql3="select value_text,article.create_time, count(*),(select value_text from dynamic_field_value where object_id=article.id and field_id='9') as test1 from dynamic_field_value 

inner join article on article.id=dynamic_field_value.object_id

where value_text >=40000 and value_text <50000 and article.create_time>='".date('Y-m-d',$oneWeekAgo)."'  group by value_text ";

$resultql3=mysql_query($BSql3,$connection);



$table3='<style> td{height: 20px; text-align:center;}</style>
<table border="1" cellspacing="1" cellpading="1">
			<tr align="center">
				<th bgcolor="#0080ff"> Problem Type</th>
				<th bgcolor="#0080ff"> Congestion issue  </th>
				<th bgcolor="#0080ff"> Date </th>
				<th bgcolor="#0080ff"> Number of tickets </th>
			</tr>';
			
			$newql3=mysql_fetch_array($resultql3);
	$table3.='<tr><td rowspan="'.mysql_num_rows($resultql3).'" align="center"> Congestion </td>
	<td>'.$finalsub[$newql3[0]].' </td>
	<td> - </td>
	<td>'.$newql3[2].' </td>
	</tr>';
while($newql3=mysql_fetch_array($resultql3)){
	$table3.='
<tr>
	<td>'.$finalsub[$newql3[0]].' </td>
	<td> - </td>
	<td> '.$newq3[2].' </td>
	</tr>
	
	
	';
	
	
}
//

$table3.='</table>';

$pdf->SetFontSize(12,true);
$pdf->writeHTML($table3, true, false, false, false, '');	

$query0="select id from queue where name LIKE '%ManagedService%'";
$action0=mysql_query($query0,$connection);


$tot=0;

$tab='<style> td{height: 20px; text-align:center;}</style>
<table border="1" cellspacing="1" cellpading="1">
			<tr align="center">
				<th bgcolor="#0080ff"> Customer Name</th>
				<th bgcolor="#0080ff"> Opened Cases  </th>
				<th bgcolor="#0080ff"> Closed Cases </th>
				<th bgcolor="#0080ff"> Escalated to NMC</th>
				<th bgcolor="#0080ff"> Escalated to Operation</th>
				<th bgcolor="#0080ff"> TOTAL</th>
				
			</tr>';
			
			
			
while($tt0=mysql_fetch_array($action0)){
	
	$query1="SELECT
	NAME ,(
		SELECT
			count(*)
		FROM
			ticket
		INNER JOIN queue ON queue.id = ticket.queue_id
		AND ticket.ticket_state_id = '4'
		AND ticket.queue_id = '".$tt0[0]."'
		AND ticket.create_time>='".date('Y-m-d',$oneWeekAgo)."'
	),
(
		SELECT
			count(*)
		FROM
			ticket
		INNER JOIN queue ON queue.id = ticket.queue_id
		AND ticket.ticket_state_id = '2'
		AND ticket.queue_id = '".$tt0[0]."'
		AND ticket.create_time>='".date('Y-m-d',$oneWeekAgo)."'
	),
	(
		SELECT
			count(*)
		FROM
			ticket
		INNER JOIN queue ON queue.id = ticket.queue_id
		AND ticket.ticket_state_id = '10'
		AND ticket.queue_id = '".$tt0[0]."'
		AND ticket.create_time>='".date('Y-m-d',$oneWeekAgo)."'
	),
	(
		SELECT
			count(*)
		FROM
			ticket
		INNER JOIN queue ON queue.id = ticket.queue_id
		AND ticket.ticket_state_id = '11'
		AND ticket.queue_id = '".$tt0[0]."'
		AND ticket.create_time>='".date('Y-m-d',$oneWeekAgo)."'
	)

FROM
	queue where queue.id='".$tt0[0]."'";
	
	$action1=mysql_query($query1,$connection);
	$res=mysql_fetch_array($action1);
	//$pdf->writeHTML($res[0], true, false, false, false, '');
	$ret=explode("::",$res[0]);
	//$pdf->writeHTML($ret[sizeof($ret)-1], true, false, false, false, '');
	if($ret[sizeof($ret)-1] !="ManagedService" && $ret[sizeof($ret)-1]!="GDS VIP Customers" ){$tab.='<tr height="50"><td>&nbsp;'.$ret[sizeof($ret)-1].'&nbsp;</td><td>'.$res[1].'</td><td>'.$res[2].'</td><td>'.$res[3].'</td><td>'.$res[4].'</td><td>'.($res[1]+$res[2]+$res[3]+$res[4]).'	</td></tr>';}
$tot+=$res[1]+$res[2]+$res[3]+$res[4];
	}


$tab.='<tr> <td colspan="5" >Total</td><td>'.$tot.'</td></tr></table>';
$pdf->SetFont('helvetica', 'B', 17);
$pdf->writeHTML("<br/><br/><br/><br/>Number of tickets per Customer:<br/>", true, false, false, false, '');

$pdf->SetFontSize(12,true);
$pdf->writeHTML($tab, true, false, false, false, '');	


$user=array(3,4,5,6,8,9);
$tut=0;
$tub='<style> td{height: 20px; text-align:center;}</style>
<table border="1" cellspacing="1" cellpading="1">
			<tr align="center">
				<th bgcolor="#0080ff"> Agent Name</th>
				<th bgcolor="#0080ff"> Opened Cases  </th>
				<th bgcolor="#0080ff"> Closed Cases </th>
				<th bgcolor="#0080ff"> Escalated to NMC</th>
				<th bgcolor="#0080ff"> Escalated to Operation</th>
				<th bgcolor="#0080ff"> TOTAL</th>
				
			</tr>';

foreach($user as $a){
$useQ="Select users.login, (select count(*) from ticket where ticket.user_id='".$a."' and ticket.create_time>='".date('Y-m-d',$oneWeekAgo)."' and ticket.ticket_state_id='4'),
(select count(*) from ticket where ticket.user_id='".$a."' and ticket.create_time>='".date('Y-m-d',$oneWeekAgo)."' and ticket.ticket_state_id='2'),
(select count(*) from ticket where ticket.user_id='".$a."' and ticket.create_time>='".date('Y-m-d',$oneWeekAgo)."' and ticket.ticket_state_id='10'),
(select count(*) from ticket where ticket.user_id='".$a."' and ticket.create_time>='".date('Y-m-d',$oneWeekAgo)."' and ticket.ticket_state_id='11') from users where users.id='".$a."'";


$UseR=mysql_query($useQ,$connection);
$rep=mysql_fetch_array($UseR);
	
	
$tub.='<tr height="50"><td>'.$rep[0].'</td><td>'.$rep[1].'</td><td>'.$rep[2].'</td><td>'.$rep[3].'</td><td>'.$rep[4].'</td><td>'.($rep[1]+$rep[2]+$rep[3]+$rep[4]).'	</td></tr>';
$tut+=$rep[1]+$rep[2]+$rep[3]+$rep[4];


}

$tub.='<tr> <td colspan="5" >Total</td><td>'.$tut.'</td></tr></table>';

$pdf->SetFont('helvetica', 'B', 17);
$pdf->writeHTML("<br/><br/><br/><br/>Number of tickets per Agent:<br/>", true, false, false, false, '');

$pdf->SetFontSize(12,true);
$pdf->writeHTML($tub, true, false, false, false, '');	













$pdf->Output('Report.pdf', 'I');

//============================================================+
// END OF FILE
//============================================================+
