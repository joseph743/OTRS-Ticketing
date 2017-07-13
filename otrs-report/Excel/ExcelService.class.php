<?php
/*
// save this file to: ExcelService.class.php

Create new folder 'libs' under your project dir, and download PHPExcel-1.8 library .zip from here..
use this clone url: git@github.com:PHPOffice/PHPExcel.git 
OR https://github.com/PHPOffice/PHPExcel.
*/

define('TMP_FILES', "temp/"); // temp folder where it stores the files into.

/** include PHPExcel classes */
/* I have in my project directory under the libs/ folder. */
$basePath = '/Classes/'; // make sure path and dir's are correct.
include_once('../Excel/Classes/PHPExcel.php');
include_once ('../Excel/Classes/PHPExcel/IOFactory.php');

class ExcelService {

	private function generateRandomName() {
		$randName = substr(md5(date('m/d/y h:i:s:u')), 0, 8);
		if(file_exists(TMP_FILES.'test.html')) {
			return $this -> generateRandomName();
		}
		return $randName;
	}

       /* Function to generate excel file from html content using php (phpexcel 2007)*/
	public function generateExcel($content) { // $content <- html_content
		
		$filename = $this -> generateRandomName();

		if( !ini_get('date.timezone') ) {
		    date_default_timezone_set('GMT');
		}
		
		if(!is_dir( TMP_FILES )) { // check if temp folder not not exists
			mkdir( TMP_FILES, 0777 ); // create new temp dir for storing xlsx files.
		}

		$htmlfile = TMP_FILES . $filename . '.html'; // create new html file under temp folder
		file_put_contents($htmlfile, utf8_decode($content)); // copy the html contents into tmp created html file
		
		$objReader = new PHPExcel_Reader_HTML; // new loader
		
		$objPHPExcel = $objReader->load($htmlfile); // load .html file that generated under temp folder
		
		// Set properties
		$objPHPExcel->getProperties()->setCreator("Joseph ELIA");
		$objPHPExcel->getProperties()->setLastModifiedBy("Joseph ELIA");
		$objPHPExcel->getProperties()->setTitle("Office 2007 XLSX Document");
		$objPHPExcel->getProperties()->setSubject("XLSX Report");
		$objPHPExcel->getProperties()->setDescription("XLSX report document for Office 2007");
		
		$gdImage = imagecreatefromjpeg('./gdslogob.jpg');
		
// Add a drawing to the worksheetecho date('H:i:s') . " Add a drawing to the worksheet\n";
$objDrawing = new PHPExcel_Worksheet_MemoryDrawing();
$objDrawing->setName('Sample image');$objDrawing->setDescription('Sample image');
$objDrawing->setImageResource($gdImage);
$objDrawing->setRenderingFunction(PHPExcel_Worksheet_MemoryDrawing::RENDERING_JPEG);
$objDrawing->setMimeType(PHPExcel_Worksheet_MemoryDrawing::MIMETYPE_DEFAULT);
$objDrawing->setHeight(170);
$objDrawing->setWidth(170);

$objDrawing->setCoordinates('A1');
$objDrawing->setWorksheet($objPHPExcel->getActiveSheet());
	
		
                /* simple style to make sure all cell's text have HORIZONTAL_LEFT alignment */
				$head = array("Problem","Updates","Note","Subject","Date","Status","Updated By");
				
				$pic=array("A1","A2","A3","A4","A5","A6","A7","A8",
							"B1","B2","B3","B4","B5","B6","B7","B8",
							"C1","C2","C3","C4","C5","C6","C7","C8",
							"D1","D2","D3","D4","D5","D6","D7","D8",
							"E1","E2","E3","E4","E5","E6","E7","E8",
							"F1","F2","F3","F4","F5","F6","F7","F8",
							"G1","G2","G3","G4","G5","G6","G7","G8");

	$objWorksheet = $objPHPExcel->getActiveSheet();
	
			//PHPExcel_Shared_Font::setAutoSizeMethod(PHPExcel_Shared_Font::	AUTOSIZE_METHOD_EXACT);
	foreach ($objWorksheet->getRowIterator() as $row) {
		$cellIterator = $row->getCellIterator();
		foreach ($cellIterator as $cell) {
			//	echo $objPHPExcel->getColumnDimension($cell);
			if(in_array($cell->getCoordinate(),$pic)){}else
    if(in_array($cell,$head)){
		//$objPHPExcel->getActiveSheet()->getStyle($cell->getCoordinate())->getColumnDimension()->getWidth();
		
		$objPHPExcel->getActiveSheet()->getStyle($cell->getCoordinate())->applyFromArray(
    array(
        'fill' => array(
            'type' => PHPExcel_Style_Fill::FILL_SOLID,
            'color' => array('rgb' => '0080ff')),
		'borders' =>array('right'=> array(
                'style' => PHPExcel_Style_Border::BORDER_THIN),
				
				'top'=> array(
                'style' => PHPExcel_Style_Border::BORDER_THIN),
				
				'bottom'=> array(
                'style' => PHPExcel_Style_Border::BORDER_THIN),
				'left'=> array(
                'style' => PHPExcel_Style_Border::BORDER_THIN)
				
				),
		'alignment' => array(
        'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER)		
				
        )
    
);

		
		
	}else {$objPHPExcel->getActiveSheet()->getStyle($cell->getCoordinate())->applyFromArray(
    array(
        
		'borders' =>array('right'=> array(
                'style' => PHPExcel_Style_Border::BORDER_THIN),
				
				'top'=> array(
                'style' => PHPExcel_Style_Border::BORDER_THIN),
				
				'bottom'=> array(
                'style' => PHPExcel_Style_Border::BORDER_THIN),
				'left'=> array(
                'style' => PHPExcel_Style_Border::BORDER_THIN)
				
				),
		'alignment' => array(
        'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
		'vertical' => PHPExcel_Style_Alignment::VERTICAL_CENTER)		
				
        )
    
);}
	
	}}

  
	

				

		//Apply the style
	        //$objPHPExcel->getActiveSheet()->getDefaultStyle()->applyFromArray($styleArray);
    
	        $excelFile = TMP_FILES . $filename . '.xlsx'; // create excel file under temp folder.
	    
		// Creates a writer to output the $objPHPExcel's content
	 	$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
		$objWriter->save($excelFile); // saving the excel file

		unlink($htmlfile); // delete .html file
		
		if(file_exists($excelFile)) {
		
			return $filename . '.xlsx';
		}
		
		return false;		
	}
	

	/* Function to download file using php.*/
	public function downloadFile($test) {
		$fields = array("fileName");
		
		$fileName = ''.TMP_FILES.$test.'';
		$fileNamePieces = explode( '.', $fileName);
		if(count($fileNamePieces) > 1) {
			$fileType = array_pop($fileNamePieces);
		}

		if(file_exists($fileName) && ($fileType == 'html' || $fileType == 'xlsx')) {
			if($fileType == 'xlsx') {
				header("Content-Type: application/vnd.ms-excel");
				header("Content-Disposition: attachment; filename=".$fileName);
				header("Pragma: no-cache");
				header("Expires: 0");
				
			}
			else {
				header('Content-Type: text/html');
			}
			 

			readfile($fileName);
			unlink($fileName); // each asset can only be accessed once, delete after access
			
			
			exit();
			
		}
		
	}
}

/*
Creator: Narain Sagar (Nine)
Created: 09-11-2015
Cheers! Thanks.
*/

?>