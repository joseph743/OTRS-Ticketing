
 

 
 
<?php 
include("dbcon.php");
 
?>
 
<?php 

function get_string_between($string, $start, $end){
    $string = ' ' . $string;
    $ini = strpos($string, $start);
    if ($ini == 0) return '';
    $ini += strlen($start);
    $len = strpos($string, $end, $ini) - $ini;
    return substr($string, $ini, $len);
}

?>
  
  
 <?php
  
    function gettable($table) {
		
		
		
		
		$art="Select config from dynamic_field where name='ticketarticle'";
		$rap=mysql_query($art); 
		$rowt=mysql_fetch_array($rap);

$newl=get_string_between($rowt[0],"PossibleValues:","TranslatableValues:");
$newl=(preg_replace("/\'[0-9]\'|\'[0-9][0-9]\'/","",$newl));
$newl=explode(":",$newl);
//unset($newl[0]);

sort($newl); 
//print_r($newl);


         $getval="";
         foreach($_GET as $query_string_variable => $value) {
			 if(isset($query_string_variable))
   $getval.= "".$query_string_variable ."=".$value."&";
   
}

        ?>

<table width="100%" style="border-collapse: collapse;">
   
            <?php
			
		
	
         $link="http://192.168.13.54/otrs-report/index.php?".$getval;
        $table = mysql_real_escape_string ( $table );
		  if($_GET["problem_type"]!="G"){

                         $sql = "SELECT COUNT(*) FROM " . $table;
$sql.=" INNER JOIN article on article.ticket_id=ticket.id INNER JOIN dynamic_field_value on dynamic_field_value.object_id=article.id  INNER JOIN users ON ticket.user_id = users.id INNER JOIN queue ON ticket.queue_id=queue.id INNER JOIN ticket_state ON ticket.ticket_state_id = ticket_state.id ";

        $sql.="WHERE ticket.ticket_state_id<>9 and dynamic_field_value.value_text =".$_GET["problem_type"]." AND ticket.title LIKE '%".$_GET["Link"]."%' and ticket_state.name Like '%".urldecode($_GET["State"])."%' and users.login LIKE '%".$_GET["Owner"]."%' and queue.name LIKE '%".urldecode($_GET["Customer"])."%'";

                }else {
        $sql = "SELECT COUNT(*) FROM " . $table;
$sql.="  INNER JOIN users ON ticket.user_id = users.id INNER JOIN queue ON ticket.queue_id=queue.id INNER JOIN ticket_state ON ticket.ticket_state_id = ticket_state.id ";

        $sql.="WHERE ticket.ticket_state_id<>9 and ticket.title LIKE '%".$_GET["Link"]."%' and ticket_state.name Like '%".urldecode($_GET["State"])."%' and users.login LIKE '%".$_GET["Owner"]."%' and queue.name LIKE '%".urldecode($_GET["Customer"])."%'";
                }

if(isset($_GET["Created"])){
        if($_GET["Modified"]!=""){
        $sql.=" AND ticket.create_time >= '".$_GET["Created"]."' AND ticket.change_time <='".$_GET["Modified"]."'";
        }else{$sql.=" AND ticket.create_time>='".$_GET["Created"]."'";}


}

/*
           if(isset($_POST["Link"])){
		   $sql.=" ticket.title LIKE '%".$_POST["Link"]."%'";}
		   else{ $sql.""; }
		 if(isset($_POST["Customer"])){
			$sql.=" and queue.name LIKE '%".$_POST["Customer"]."%'"; 
		 }else{ $sql.=""; }
		 if(isset($_POST["State"])){
			$sql.=" and ticket_state.name LIKE '%".$_POST["State"]."%'"; 
		 } else { $sql.="";}
		 if(isset($_POST["Owner"])){
			$sql.=" AND users.login LIKE '%".$_POST["Owner"]."%'";
		 }else {$sql.="";}
		 if(isset($_POST["Created"])){
			$sql.=" AND ticket.create_time >='".$_POST["Created"]."' AND ticket.change_time <='".$_POST["Modified"]."'"	;
		 }
		 
*/

	
        $result = mysql_query ( $sql ) or die ( mysql_error () );
         
        $row = mysql_fetch_row ( $result );
         
        $rows = $row [0];
         
        $page_rows = 100;
         
        $last = ceil ( $rows / $page_rows );
         
        if ($last < 1) {
            $last = 1;
        }
         
        $pagenum =1;
         
        if (isset( $_GET["page"])){
            $pagenum =$_GET["page"];
        }

        if ($pagenum < 1) {
            $pagenum = 1;
			
        } else if ($pagenum > $last) {
            $pagenum = $last;
		
        }

		
		echo $sql;

       $limit = " LIMIT " . (($pagenum - 1) * $page_rows ). ", " . $page_rows;
	if($_GET["problem_type"]!="G"){
                   
       $sql1 = "SELECT ticket.id,ticket.title AS Link , ticket.create_time AS Created , ticket.change_time AS Modified, queue.name AS Customer,ticket_state.name as State ,users.login AS Owner FROM ticket INNER JOIN article on article.ticket_id=ticket.id INNER JOIN dynamic_field_value on dynamic_field_value.object_id=article.id ";
       $sql1.="INNER JOIN users ON ticket.user_id = users.id INNER JOIN queue ON ticket.queue_id=queue.id INNER JOIN ticket_state ON ticket.ticket_state_id = ticket_state.id WHERE ticket.ticket_state_id<>9 and dynamic_field_value.value_text =".$_GET["problem_type"]." AND ticket.title LIKE '%".$_GET["Link"]."%' and ticket_state.name Like '%".urldecode($_GET["State"])."%' and users.login LIKE '%".$_GET["Owner"]."%' and queue.name LIKE '%".urldecode($_GET["Customer"])."%'";
           }
           else {
                   $sql1 = "SELECT ticket.id,ticket.title AS Link , ticket.create_time AS Created , ticket.change_time AS Modified, queue.name AS Customer,ticket_state.name as State ,users.login AS Owner FROM ticket ";
       $sql1.="INNER JOIN users ON ticket.user_id = users.id INNER JOIN queue ON ticket.queue_id=queue.id INNER JOIN ticket_state ON ticket.ticket_state_id = ticket_state.id WHERE ticket.ticket_state_id<>9 and ticket.title LIKE '%".$_GET["Link"]."%' and ticket_state.name Like '%".urldecode($_GET["State"])."%' and users.login LIKE '%".$_GET["Owner"]."%' and queue.name LIKE '%".urldecode($_GET["Customer"])."%'";
           
           }


	if(isset($_GET["Created"])){
	if($_GET["Modified"]!=""){
	$sql1.=" AND ticket.create_time >= '".$_GET["Created"]."' AND ticket.change_time <='".$_GET["Modified"]."' ";
	}
	else {$sql1.=" AND ticket.create_time>='".$_GET["Created"]."'";}
	}else{$sql1.=" AND ticket.modified_time<='".$_GET["Modified"]."' ";}
	$sql1.=" order by ticket.create_time DESC ";
	$sql1.=$limit;
	//echo $sql1;
        $result = mysql_query ( $sql1 ) or die ( mysql_error () );
         
        $textline1 = " Total tickets  [<b>" . $rows . "</b>]  ";
        $textline2 = "| Page <b>" . $pagenum . "</b> of <b>" . $last . "</b>";
         
        $pagination = ""; ?>
         		<p align="center"><?php
         
echo $textline1;
        echo $pagination;
      
	  
	  echo $sql1;
    ?> </p> <?php 
        if ($last != 1)
 
        {
            if ($pagenum > 1) {
                $previous = $pagenum - 1;
                 
                $pagination .= "<a href=\"" . $link . "&page=" . $previous . "\"> Previous </a> &nbsp;";
                 
                for($i = $pagenum - 35; $i < $pagenum; $i ++)
                    if ($i > 0) {
                        $pagination .= "<a href=\"" . $link . "&page=" . $i . "\"> " . $i . " </a> &nbsp;";
                    }
            }
            $pagination .= $pagenum . "&nbsp;";
             
            for($i = $pagenum + 1; $i <= $last; $i ++) {
                 
                $pagination .= "<a href=\"" . $link . "&page=" . $i . "\"> " . $i . " </a> &nbsp;";
                if ($i >= $pagenum + 35) {
                    break;
                }
            }
             
            if ($pagenum != $last) {
                $next = $pagenum + 1;
                $pagination .= "<a href=\"" . $link . "&page=" . $next . "\"> Next </a> &nbsp;";
            }
        }
        ?>
		<tr class="result" style="text-align:inner; padding:8px; background-color: #f2f2f2;">	
            <?php
         
        if ($rows != 0) {
            for($i = 1; $i < mysql_num_fields ( $result ); $i ++) {
                 
               ?>
			
        <th class="res">
                <?php echo mysql_field_name($result, $i); ?>
                 
            </th><?php } ?><th class="res">View History</th>
             </tr>
            <?php
             
            while ( $row = mysql_fetch_array ( $result ) ) {
                 
                ?>
                 
                 
     
     
    <tr  class="result">
						<td> <?php echo get_string_between($row [mysql_field_name ( $result, 1 )],":",":"); ?> </td>
						
                <?php for($i=2;$i<mysql_num_fields($result);$i++){ ?>
                    
                        <?php
						if($i==4){ ?> <td> <?php  $rt=explode("::",$row [mysql_field_name ( $result, 4 )]); echo $rt[sizeof($rt)-1]; ?></td> <?php
						}else if($i==7){ ?> <td> <?php echo $newl[$row [mysql_field_name ( $result, 7 )]];} else{
						?> </td><td> <?php echo $row [mysql_field_name ( $result, $i )]; ?> </td> <?php }
                }
                ?>
                    
			 <?php echo "<td><a href=http://192.168.13.54/otrs-report/ticket.php?ticket=".$row [mysql_field_name ( $result, 0 )]." >View History</a>"; ?>
        </td>
    
                         
            <?php } }?>
             
             
 </tr>
</table>
 
 
 

<p align="center"><?php
         
echo $textline1;
        echo $pagination;
        echo $textline2;
    }
    ?> </p>
	
 
          
 


