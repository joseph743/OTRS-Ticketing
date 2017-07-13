(function($){$.extend({tablesorter:new
function(){var parsers=[],widgets=[];this.defaults={cssHeader:"header",cssAsc:"headerSortUp",cssDesc:"headerSortDown",cssChildRow:"expand-child",sortInitialOrder:"asc",sortMultiSortKey:"shiftKey",sortForce:null,sortAppend:null,sortLocaleCompare:true,textExtraction:"simple",parsers:{},widgets:[],widgetZebra:{css:["even","odd"]},headers:{},widthFixed:false,cancelSelection:true,sortList:[],headerList:[],dateFormat:"us",decimal:'/\.|\,/g',onRenderHeader:null,selectorHeaders:'thead th',debug:false};function benchmark(s,d){log(s+","+(new Date().getTime()-d.getTime())+"ms");}
this.benchmark=benchmark;function log(s){if(typeof console!="undefined"&&typeof console.debug!="undefined"){console.log(s);}else{alert(s);}}
function buildParserCache(table,$headers){if(table.config.debug){var parsersDebug="";}
if(table.tBodies.length==0)return;var rows=table.tBodies[0].rows;if(rows[0]){var list=[],cells=rows[0].cells,l=cells.length;for(var i=0;i<l;i++){var p=false;if($.metadata&&($($headers[i]).metadata()&&$($headers[i]).metadata().sorter)){p=getParserById($($headers[i]).metadata().sorter);}else if((table.config.headers[i]&&table.config.headers[i].sorter)){p=getParserById(table.config.headers[i].sorter);}
if(!p){p=detectParserForColumn(table,rows,-1,i);}
if(table.config.debug){parsersDebug+="column:"+i+" parser:"+p.id+"\n";}
list.push(p);}}
if(table.config.debug){log(parsersDebug);}
return list;};function detectParserForColumn(table,rows,rowIndex,cellIndex){var l=parsers.length,node=false,nodeValue=false,keepLooking=true;while(nodeValue==''&&keepLooking){rowIndex++;if(rows[rowIndex]){node=getNodeFromRowAndCellIndex(rows,rowIndex,cellIndex);nodeValue=trimAndGetNodeText(table.config,node);if(table.config.debug){log('Checking if value was empty on row:'+rowIndex);}}else{keepLooking=false;}}
for(var i=1;i<l;i++){if(parsers[i].is(nodeValue,table,node)){return parsers[i];}}
return parsers[0];}
function getNodeFromRowAndCellIndex(rows,rowIndex,cellIndex){return rows[rowIndex].cells[cellIndex];}
function trimAndGetNodeText(config,node){return $.trim(getElementText(config,node));}
function getParserById(name){var l=parsers.length;for(var i=0;i<l;i++){if(parsers[i].id.toLowerCase()==name.toLowerCase()){return parsers[i];}}
return false;}
function buildCache(table){if(table.config.debug){var cacheTime=new Date();}
var totalRows=(table.tBodies[0]&&table.tBodies[0].rows.length)||0,totalCells=(table.tBodies[0].rows[0]&&table.tBodies[0].rows[0].cells.length)||0,parsers=table.config.parsers,cache={row:[],normalized:[]};for(var i=0;i<totalRows;++i){var c=$(table.tBodies[0].rows[i]),cols=[];if(c.hasClass(table.config.cssChildRow)){cache.row[cache.row.length-1]=cache.row[cache.row.length-1].add(c);continue;}
cache.row.push(c);for(var j=0;j<totalCells;++j){cols.push(parsers[j].format(getElementText(table.config,c[0].cells[j]),table,c[0].cells[j]));}
cols.push(cache.normalized.length);cache.normalized.push(cols);cols=null;};if(table.config.debug){benchmark("Building cache for "+totalRows+" rows:",cacheTime);}
return cache;};function getElementText(config,node){var text="";if(!node)return"";if(!config.supportsTextContent)config.supportsTextContent=node.textContent||false;if(config.textExtraction=="simple"){if(config.supportsTextContent){text=node.textContent;}else{if(node.childNodes[0]&&node.childNodes[0].hasChildNodes()){text=node.childNodes[0].innerHTML;}else{text=node.innerHTML;}}}else{if(typeof(config.textExtraction)=="function"){text=config.textExtraction(node);}else{text=$(node).text();}}
return text;}
function appendToTable(table,cache){if(table.config.debug){var appendTime=new Date()}
var c=cache,r=c.row,n=c.normalized,totalRows=n.length,checkCell=(n[0].length-1),tableBody=$(table.tBodies[0]),rows=[];for(var i=0;i<totalRows;i++){var pos=n[i][checkCell];rows.push(r[pos]);if(!table.config.appender){var l=r[pos].length;for(var j=0;j<l;j++){tableBody[0].appendChild(r[pos][j]);}
}}
if(table.config.appender){table.config.appender(table,rows);}
rows=null;if(table.config.debug){benchmark("Rebuilt table:",appendTime);}
applyWidget(table);setTimeout(function(){$(table).trigger("sortEnd");},0);};function buildHeaders(table){if(table.config.debug){var time=new Date();}
var meta=($.metadata)?true:false;var header_index=computeTableHeaderCellIndexes(table);$tableHeaders=$(table.config.selectorHeaders,table).each(function(index){this.column=header_index[this.parentNode.rowIndex+"-"+this.cellIndex];this.order=formatSortingOrder(table.config.sortInitialOrder);this.count=this.order;if(checkHeaderMetadata(this)||checkHeaderOptions(table,index))this.sortDisabled=true;if(checkHeaderOptionsSortingLocked(table,index))this.order=this.lockedOrder=checkHeaderOptionsSortingLocked(table,index);if(!this.sortDisabled){var $th=$(this).addClass(table.config.cssHeader);if(table.config.onRenderHeader)table.config.onRenderHeader.apply($th);}
table.config.headerList[index]=this;});if(table.config.debug){benchmark("Built headers:",time);log($tableHeaders);}
return $tableHeaders;};function computeTableHeaderCellIndexes(t){var matrix=[];var lookup={};var thead=t.getElementsByTagName('THEAD')[0];var trs=thead.getElementsByTagName('TR');for(var i=0;i<trs.length;i++){var cells=trs[i].cells;for(var j=0;j<cells.length;j++){var c=cells[j];var rowIndex=c.parentNode.rowIndex;var cellId=rowIndex+"-"+c.cellIndex;var rowSpan=c.rowSpan||1;var colSpan=c.colSpan||1
var firstAvailCol;if(typeof(matrix[rowIndex])=="undefined"){matrix[rowIndex]=[];}
for(var k=0;k<matrix[rowIndex].length+1;k++){if(typeof(matrix[rowIndex][k])=="undefined"){firstAvailCol=k;break;}}
lookup[cellId]=firstAvailCol;for(var k=rowIndex;k<rowIndex+rowSpan;k++){if(typeof(matrix[k])=="undefined"){matrix[k]=[];}
var matrixrow=matrix[k];for(var l=firstAvailCol;l<firstAvailCol+colSpan;l++){matrixrow[l]="x";}}}}
return lookup;}
function checkCellColSpan(table,rows,row){var arr=[],r=table.tHead.rows,c=r[row].cells;for(var i=0;i<c.length;i++){var cell=c[i];if(cell.colSpan>1){arr=arr.concat(checkCellColSpan(table,headerArr,row++));}else{if(table.tHead.length==1||(cell.rowSpan>1||!r[row+1])){arr.push(cell);}
}}
return arr;};function checkHeaderMetadata(cell){if(($.metadata)&&($(cell).metadata().sorter===false)){return true;};return false;}
function checkHeaderOptions(table,i){if((table.config.headers[i])&&(table.config.headers[i].sorter===false)){return true;};return false;}
function checkHeaderOptionsSortingLocked(table,i){if((table.config.headers[i])&&(table.config.headers[i].lockedOrder))return table.config.headers[i].lockedOrder;return false;}
function applyWidget(table){var c=table.config.widgets;var l=c.length;for(var i=0;i<l;i++){getWidgetById(c[i]).format(table);}}
function getWidgetById(name){var l=widgets.length;for(var i=0;i<l;i++){if(widgets[i].id.toLowerCase()==name.toLowerCase()){return widgets[i];}}};function formatSortingOrder(v){if(typeof(v)!="Number"){return(v.toLowerCase()=="desc")?1:0;}else{return(v==1)?1:0;}}
function isValueInArray(v,a){var l=a.length;for(var i=0;i<l;i++){if(a[i][0]==v){return true;}}
return false;}
function setHeadersCss(table,$headers,list,css){$headers.removeClass(css[0]).removeClass(css[1]);var h=[];$headers.each(function(offset){if(!this.sortDisabled){h[this.column]=$(this);}});var l=list.length;for(var i=0;i<l;i++){h[list[i][0]].addClass(css[list[i][1]]);}}
function fixColumnWidth(table,$headers){var c=table.config;if(c.widthFixed){var colgroup=$('<colgroup>');$("tr:first td",table.tBodies[0]).each(function(){colgroup.append($('<col>').css('width',$(this).width()));});$(table).prepend(colgroup);};}
function updateHeaderSortCount(table,sortList){var c=table.config,l=sortList.length;for(var i=0;i<l;i++){var s=sortList[i],o=c.headerList[s[0]];o.count=s[1];o.count++;}}
function multisort(table,sortList,cache){if(table.config.debug){var sortTime=new Date();}
var dynamicExp="var sortWrapper = function(a,b) {",l=sortList.length;for(var i=0;i<l;i++){var c=sortList[i][0];var order=sortList[i][1];var s=(table.config.parsers[c].type=="text")?((order==0)?makeSortFunction("text","asc",c):makeSortFunction("text","desc",c)):((order==0)?makeSortFunction("numeric","asc",c):makeSortFunction("numeric","desc",c));var e="e"+i;dynamicExp+="var "+e+" = "+s;dynamicExp+="if("+e+") { return "+e+"; } ";dynamicExp+="else { ";}
var orgOrderCol=cache.normalized[0].length-1;dynamicExp+="return a["+orgOrderCol+"]-b["+orgOrderCol+"];";for(var i=0;i<l;i++){dynamicExp+="}; ";}
dynamicExp+="return 0; ";dynamicExp+="}; ";if(table.config.debug){benchmark("Evaling expression:"+dynamicExp,new Date());}
eval(dynamicExp);cache.normalized.sort(sortWrapper);if(table.config.debug){benchmark("Sorting on "+sortList.toString()+" and dir "+order+" time:",sortTime);}
return cache;};function makeSortFunction(type,direction,index){var a="a["+index+"]",b="b["+index+"]";if(type=='text'&&direction=='asc'){return"("+a+" == "+b+" ? 0 : ("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : ("+a+" < "+b+") ? -1 : 1 )));";}else if(type=='text'&&direction=='desc'){return"("+a+" == "+b+" ? 0 : ("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : ("+b+" < "+a+") ? -1 : 1 )));";}else if(type=='numeric'&&direction=='asc'){return"("+a+" === null && "+b+" === null) ? 0 :("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : "+a+" - "+b+"));";}else if(type=='numeric'&&direction=='desc'){return"("+a+" === null && "+b+" === null) ? 0 :("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : "+b+" - "+a+"));";}};function makeSortText(i){return"((a["+i+"] < b["+i+"]) ? -1 : ((a["+i+"] > b["+i+"]) ? 1 : 0));";};function makeSortTextDesc(i){return"((b["+i+"] < a["+i+"]) ? -1 : ((b["+i+"] > a["+i+"]) ? 1 : 0));";};function makeSortNumeric(i){return"a["+i+"]-b["+i+"];";};function makeSortNumericDesc(i){return"b["+i+"]-a["+i+"];";};function sortText(a,b){if(table.config.sortLocaleCompare)return a.localeCompare(b);return((a<b)?-1:((a>b)?1:0));};function sortTextDesc(a,b){if(table.config.sortLocaleCompare)return b.localeCompare(a);return((b<a)?-1:((b>a)?1:0));};function sortNumeric(a,b){return a-b;};function sortNumericDesc(a,b){return b-a;};function getCachedSortType(parsers,i){return parsers[i].type;};this.construct=function(settings){return this.each(function(){if(!this.tHead||!this.tBodies)return;var $this,$document,$headers,cache,config,shiftDown=0,sortOrder;this.config={};config=$.extend(this.config,$.tablesorter.defaults,settings);$this=$(this);$.data(this,"tablesorter",config);$headers=buildHeaders(this);this.config.parsers=buildParserCache(this,$headers);cache=buildCache(this);var sortCSS=[config.cssDesc,config.cssAsc];fixColumnWidth(this);$headers.click(function(e){var totalRows=($this[0].tBodies[0]&&$this[0].tBodies[0].rows.length)||0;if(!this.sortDisabled&&totalRows>0){$this.trigger("sortStart");var $cell=$(this);var i=this.column;this.order=this.count++%2;if(this.lockedOrder)this.order=this.lockedOrder;if(!e[config.sortMultiSortKey]){config.sortList=[];if(config.sortForce!=null){var a=config.sortForce;for(var j=0;j<a.length;j++){if(a[j][0]!=i){config.sortList.push(a[j]);}}}
config.sortList.push([i,this.order]);}else{if(isValueInArray(i,config.sortList)){for(var j=0;j<config.sortList.length;j++){var s=config.sortList[j],o=config.headerList[s[0]];if(s[0]==i){o.count=s[1];o.count++;s[1]=o.count%2;}}}else{config.sortList.push([i,this.order]);}};setTimeout(function(){setHeadersCss($this[0],$headers,config.sortList,sortCSS);appendToTable($this[0],multisort($this[0],config.sortList,cache));},1);return false;}
}).mousedown(function(){if(config.cancelSelection){this.onselectstart=function(){return false};return false;}});$this.bind("update",function(){var me=this;setTimeout(function(){me.config.parsers=buildParserCache(me,$headers);cache=buildCache(me);},1);}).bind("updateCell",function(e,cell){var config=this.config;var pos=[(cell.parentNode.rowIndex-1),cell.cellIndex];cache.normalized[pos[0]][pos[1]]=config.parsers[pos[1]].format(getElementText(config,cell),cell);}).bind("sorton",function(e,list){$(this).trigger("sortStart");config.sortList=list;var sortList=config.sortList;updateHeaderSortCount(this,sortList);setHeadersCss(this,$headers,sortList,sortCSS);appendToTable(this,multisort(this,sortList,cache));}).bind("appendCache",function(){appendToTable(this,cache);}).bind("applyWidgetId",function(e,id){getWidgetById(id).format(this);}).bind("applyWidgets",function(){applyWidget(this);});if($.metadata&&($(this).metadata()&&$(this).metadata().sortlist)){config.sortList=$(this).metadata().sortlist;}
if(config.sortList.length>0){$this.trigger("sorton",[config.sortList]);}
applyWidget(this);});};this.addParser=function(parser){var l=parsers.length,a=true;for(var i=0;i<l;i++){if(parsers[i].id.toLowerCase()==parser.id.toLowerCase()){a=false;}}
if(a){parsers.push(parser);};};this.addWidget=function(widget){widgets.push(widget);};this.formatFloat=function(s){var i=parseFloat(s);return(isNaN(i))?0:i;};this.formatInt=function(s){var i=parseInt(s);return(isNaN(i))?0:i;};this.isDigit=function(s,config){return/^[-+]?\d*$/.test($.trim(s.replace(/[,.']/g,'')));};this.clearTableBody=function(table){if($.browser.msie){function empty(){while(this.firstChild)
this.removeChild(this.firstChild);}
empty.apply(table.tBodies[0]);}else{table.tBodies[0].innerHTML="";}};}});$.fn.extend({tablesorter:$.tablesorter.construct});var ts=$.tablesorter;ts.addParser({id:"text",is:function(s){return true;},format:function(s){return $.trim(s.toLocaleLowerCase());},type:"text"});ts.addParser({id:"digit",is:function(s,table){var c=table.config;return $.tablesorter.isDigit(s,c);},format:function(s){return $.tablesorter.formatFloat(s);},type:"numeric"});ts.addParser({id:"currency",is:function(s){return/^[£$€?.]/.test(s);},format:function(s){return $.tablesorter.formatFloat(s.replace(new RegExp(/[£$€]/g),""));},type:"numeric"});ts.addParser({id:"ipAddress",is:function(s){return/^\d{2,3}[\.]\d{2,3}[\.]\d{2,3}[\.]\d{2,3}$/.test(s);},format:function(s){var a=s.split("."),r="",l=a.length;for(var i=0;i<l;i++){var item=a[i];if(item.length==2){r+="0"+item;}else{r+=item;}}
return $.tablesorter.formatFloat(r);},type:"numeric"});ts.addParser({id:"url",is:function(s){return/^(https?|ftp|file):\/\/$/.test(s);},format:function(s){return jQuery.trim(s.replace(new RegExp(/(https?|ftp|file):\/\//),''));},type:"text"});ts.addParser({id:"isoDate",is:function(s){return/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(s);},format:function(s){return $.tablesorter.formatFloat((s!="")?new Date(s.replace(new RegExp(/-/g),"/")).getTime():"0");},type:"numeric"});ts.addParser({id:"percent",is:function(s){return/\%$/.test($.trim(s));},format:function(s){return $.tablesorter.formatFloat(s.replace(new RegExp(/%/g),""));},type:"numeric"});ts.addParser({id:"usLongDate",is:function(s){return s.match(new RegExp(/^[A-Za-z]{3,10}\.? [0-9]{1,2}, ([0-9]{4}|'?[0-9]{2}) (([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(AM|PM)))$/));},format:function(s){return $.tablesorter.formatFloat(new Date(s).getTime());},type:"numeric"});ts.addParser({id:"shortDate",is:function(s){return(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/).test(s);},format:function(s,table){var c=table.config;s=s.replace(/\-/g,"/");if(c.dateFormat=="us"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,"$3/$1/$2");}else if(c.dateFormat=="uk"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,"$3/$2/$1");}else if(c.dateFormat=="dd/mm/yy"||c.dateFormat=="dd-mm-yy"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})/,"$1/$2/$3");}
return $.tablesorter.formatFloat(new Date(s).getTime());},type:"numeric"});ts.addParser({id:"time",is:function(s){return/^(([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(am|pm)))$/.test(s);},format:function(s){return $.tablesorter.formatFloat(new Date("2000/01/01 "+s).getTime());},type:"numeric"});ts.addParser({id:"metadata",is:function(s){return false;},format:function(s,table,cell){var c=table.config,p=(!c.parserMetadataName)?'sortValue':c.parserMetadataName;return $(cell).metadata()[p];},type:"numeric"});ts.addWidget({id:"zebra",format:function(table){if(table.config.debug){var time=new Date();}
var $tr,row=-1,odd;$("tr:visible",table.tBodies[0]).each(function(i){$tr=$(this);if(!$tr.hasClass(table.config.cssChildRow))row++;odd=(row%2==0);$tr.removeClass(table.config.widgetZebra.css[odd?0:1]).addClass(table.config.widgetZebra.css[odd?1:0])});if(table.config.debug){$.tablesorter.benchmark("Applying Zebra widget",time);}}});})(jQuery);
"use strict";var Core=Core||{};Core.Agent=Core.Agent||{};Core.Agent.TicketZoom=(function(TargetNS){var CheckURLHashTimeout,InitialArticleID;TargetNS.MarkTicketAsSeen=function(TicketID){TargetNS.TicketMarkAsSeenTimeout=window.setTimeout(function(){var Data={Action:'AgentTicketZoom',Subaction:'TicketMarkAsSeen',TicketID:TicketID};$('#ArticleTable .ArticleID').closest('tr').removeClass('UnreadArticles').find('span.UnreadArticles').remove();Core.AJAX.FunctionCall(Core.Config.Get('CGIHandle'),Data,function(){});},3000);};TargetNS.MarkAsSeen=function(TicketID,ArticleID,Timeout){if(typeof Timeout==='undefined'){Timeout=3000;}
TargetNS.MarkAsSeenTimeout=window.setTimeout(function(){var Data={Action:'AgentTicketZoom',Subaction:'MarkAsSeen',TicketID:TicketID,ArticleID:ArticleID};$('#ArticleTable .ArticleID[value='+ArticleID+']').closest('tr').removeClass('UnreadArticles').find('span.UnreadArticles').remove();$('.TimelineView li#ArticleID_'+ArticleID).find('.UnreadArticles').fadeOut(function(){$(this).closest('li').addClass('Seen');});Core.AJAX.FunctionCall(Core.Config.Get('CGIHandle'),Data,function(){});},parseInt(Timeout,10));};TargetNS.IframeAutoHeight=function($Iframe){var NewHeight;if(isJQueryObject($Iframe)){$Iframe.width($Iframe.width()-2);NewHeight=$Iframe.contents().height();if(!NewHeight||isNaN(NewHeight)){NewHeight=Core.Config.Get('Ticket::Frontend::HTMLArticleHeightDefault');}
else{if(NewHeight>Core.Config.Get('Ticket::Frontend::HTMLArticleHeightMax')){NewHeight=Core.Config.Get('Ticket::Frontend::HTMLArticleHeightMax');}}
NewHeight=parseInt(NewHeight,10)+25;$Iframe.height(NewHeight+'px');}};function LoadArticle(ArticleURL,ArticleID){window.clearTimeout(CheckURLHashTimeout);$('#ArticleItems .WidgetBox').addClass('Loading');Core.AJAX.ContentUpdate($('#ArticleItems'),ArticleURL,function(){var ScrollerY=parseInt($('div.Scroller').offset().top,10),ScrollerHeight=parseInt($('div.Scroller').height(),10),ActiveArticlePosY=parseInt($('#ArticleTable tbody tr.Active').offset().top,10),ActiveArticleHeight=parseInt($('#ArticleTable tbody tr.Active').height(),10),ActiveArticleBottomY=ActiveArticlePosY+ActiveArticleHeight,ScrollerBottomY=ScrollerY+ScrollerHeight,ScrollerOffset=$('div.Scroller').get(0).scrollTop;$('#ArticleItems a.AsPopup').bind('click',function(){var Matches,PopupType='TicketAction';Matches=$(this).attr('class').match(/PopupType_(\w+)/);if(Matches){PopupType=Matches[1];}
Core.UI.Popup.OpenPopup($(this).attr('href'),PopupType);return false;});Core.UI.InputFields.Activate($('#ArticleItems'));Core.UI.InitWidgetActionToggle();if(ArticleID===InitialArticleID){location.hash='';TargetNS.ActiveURLHash=ArticleID;}
else{location.hash='#'+ArticleID;TargetNS.ActiveURLHash=ArticleID;}
$('label.Switchable').off('click.Switch').on('click.Switch',function(){$(this).next('p.Value').find('.Switch').toggleClass('Hidden');});$('#ArticleItems .WidgetBox').removeClass('Loading');if(ActiveArticlePosY<ScrollerY){$('div.Scroller').get(0).scrollTop=ScrollerOffset+(ActiveArticlePosY-ScrollerY)-5;}
else if(ScrollerBottomY<ActiveArticleBottomY){$('div.Scroller').get(0).scrollTop=ScrollerOffset+(ActiveArticleBottomY-ScrollerBottomY)+5;}
TargetNS.CheckURLHash();Core.Agent.CheckSessionExpiredAndReload();});}
TargetNS.LoadArticleFromExternal=function(ArticleID,WindowObject){var $Element=$('#ArticleTable td.No input.ArticleID[value='+ArticleID+']'),ArticleURL;if($('.ArticleView .Timeline').hasClass('Active')){window.location.hash='#ArticleID_'+ArticleID;}
else{if(!$Element.length){if(typeof WindowObject==='undefined'){WindowObject=window;}
WindowObject.alert(Core.Config.Get('Language.AttachmentViewMessage'));return;}
ArticleURL=$Element.siblings('.ArticleInfo').val();LoadArticle(ArticleURL,ArticleID);}};TargetNS.CheckURLHash=function(){var URLHash=location.hash.replace(/#/,''),$ArticleElement;if(URLHash===''){URLHash=InitialArticleID;}
if(typeof TargetNS.ActiveURLHash==='undefined'){TargetNS.ActiveURLHash=InitialArticleID;}
else if(TargetNS.ActiveURLHash!==URLHash){TargetNS.ActiveURLHash=URLHash;$ArticleElement=$('#ArticleTable').find('input.ArticleID[value='+TargetNS.ActiveURLHash+']');if($ArticleElement.length){$($ArticleElement).closest('table').find('tr').removeClass('Active').end().end().closest('tr').addClass('Active');LoadArticle($ArticleElement.closest('td').find('input.ArticleInfo').val(),TargetNS.ActiveURLHash);}}
window.clearTimeout(CheckURLHashTimeout);CheckURLHashTimeout=window.setTimeout(function(){TargetNS.CheckURLHash();},500);};TargetNS.Init=function(Options){var ZoomExpand=false,URLHash,$ArticleElement,ResizeTimeoutScroller;if($('div.ArticleView a.OneArticle').length){ZoomExpand=!$('div.ArticleView a.OneArticle').hasClass('Active');}
Core.UI.Resizable.Init($('#ArticleTableBody'),Options.ArticleTableHeight,function(Event,UI,Height){window.clearTimeout(ResizeTimeoutScroller);ResizeTimeoutScroller=window.setTimeout(function(){Core.Agent.PreferencesUpdate('UserTicketZoomArticleTableHeight',Height);},1000);});$('.DataTable tbody td a.Attachment').bind('click',function(Event){var Position;if($(this).attr('rel')&&$('#'+$(this).attr('rel')).length){Position=$(this).offset();Core.UI.Dialog.ShowContentDialog($('#'+$(this).attr('rel'))[0].innerHTML,'Attachments',Position.top-$(window).scrollTop(),parseInt(Position.left,10)+25);}
Event.preventDefault();Event.stopPropagation();return false;});Core.UI.Table.Sort.Init($('#ArticleTable'));if(!ZoomExpand){URLHash=location.hash.replace(/#/,'');if(URLHash===''){InitialArticleID=$('#ArticleTable tr.Active input.ArticleID').val();}
else{$ArticleElement=$('#ArticleTable').find('input.ArticleID[value='+URLHash+']');if($ArticleElement.length){$ArticleElement.closest('table').find('tr').removeClass('Active').end().end().closest('tr').addClass('Active');LoadArticle($ArticleElement.closest('td').find('input.ArticleInfo').val(),URLHash);}}}
$('a.Timeline').bind('click',function(){$(this).attr('href',$(this).attr('href')+';ArticleID='+URLHash);});$('#ArticleTable tbody tr').bind('click',function(){Core.App.Publish('Event.Agent.TicketZoom.ArticleClick');if(!ZoomExpand){$(this).closest('table').find('tr').removeClass('Active').end().end().addClass('Active');$(this).closest('tr').removeClass('UnreadArticles').find('span.UnreadArticles').remove();LoadArticle($(this).find('input.ArticleInfo').val(),$(this).find('input.ArticleID').val());}
else{location.href='#Article'+$(this).find('input.ArticleID').val();}
return false;});if(!ZoomExpand){TargetNS.CheckURLHash();}
$('a.AsPopup').bind('click',function(){var Matches,PopupType='TicketAction';Matches=$(this).attr('class').match(/PopupType_(\w+)/);if(Matches){PopupType=Matches[1];}
Core.UI.Popup.OpenPopup($(this).attr('href'),PopupType);return false;});if(!ZoomExpand&&$('#ArticleTable tbody tr.Active').length){$('div.Scroller').get(0).scrollTop=parseInt($('#ArticleTable tbody tr.Active').position().top,10)-30;}
if($('.MessageBrowser').length){$('.MessageBrowser a.Close').on('click',function(){$('.MessageBrowser').fadeOut("slow");Core.Agent.PreferencesUpdate('UserAgentDoNotShowBrowserLinkMessage',1);return false;});}
$('label.Switchable').off('click.Switch').on('click.Switch',function(){$(this).next('p.Value').find('.Switch').toggleClass('Hidden');});Core.Agent.TableFilters.SetAllocationList();};return TargetNS;}(Core.Agent.TicketZoom||{}));

"use strict";var Core=Core||{};Core.UI=Core.UI||{};Core.UI.AllocationList=(function(TargetNS){if(!Core.Debug.CheckDependency('Core.UI.AllocationList','$([]).sortable','jQuery UI sortable')){return false;}
TargetNS.GetResult=function(ResultListSelector,DataAttribute){var $List=$(ResultListSelector),Result=[];if(!$List.length||!$List.find('li').length){return[];}
$List.find('li').each(function(){var Value=$(this).data(DataAttribute);if(typeof Value!=='undefined'){Result.push(Value);}});return Result;};TargetNS.Init=function(ListSelector,ConnectorSelector,ReceiveCallback,RemoveCallback,SortStopCallback){var $Lists=$(ListSelector);if(!$Lists.length){return;}
$Lists
.find('li').removeClass('Even').end()
.sortable({connectWith:ConnectorSelector,receive:function(Event,UI){if($.isFunction(ReceiveCallback)){ReceiveCallback(Event,UI);}},remove:function(Event,UI){if($.isFunction(RemoveCallback)){RemoveCallback(Event,UI);}},stop:function(Event,UI){if($.isFunction(SortStopCallback)){SortStopCallback(Event,UI);}}}).disableSelection();};return TargetNS;}(Core.UI.AllocationList||{}));

"use strict";var Core=Core||{};Core.UI=Core.UI||{};Core.UI.Table=Core.UI.Table||{};Core.UI.Table.Sort=(function(TargetNS){function CustomTextExtractor($Node){return $($Node).find('.SortData').val()||'';}
TargetNS.Init=function($Table,Finished){var $SortableColumns,$InitialSorting,SortOrder,Headers={},InitialSort=[],ColumnCount=0;if(isJQueryObject($Table)){$SortableColumns=$Table.find('th.Sortable');$InitialSorting=$SortableColumns.filter('.InitialSorting');if($SortableColumns.length){$Table.find('th').each(function(){if(!$(this).hasClass('Sortable')){Headers[ColumnCount]={sorter:false};}
ColumnCount++;});if($InitialSorting.length===1){SortOrder=$InitialSorting.hasClass('Descending')?'1':'0';InitialSort=[[$InitialSorting.index(),SortOrder]];}
$Table.tablesorter({headers:Headers,sortList:InitialSort,textExtraction:CustomTextExtractor});if($.isFunction(Finished)){$Table.bind('sortEnd',Finished);}}}};return TargetNS;}(Core.UI.Table.Sort||{}));

"use strict";var Core=Core||{};Core.Agent=Core.Agent||{};Core.Agent.TableFilters=(function(TargetNS){if(!Core.Debug.CheckDependency('Core.Agent.TableFilters','Core.UI.AllocationList','Core.UI.AllocationList')){return false;}
TargetNS.InitCustomerIDAutocomplete=function($Input){$Input.autocomplete({minLength:Core.Config.Get('CustomerIDAutocomplete.MinQueryLength'),delay:Core.Config.Get('CustomerIDAutocomplete.QueryDelay'),open:function(){$(this).autocomplete('widget').addClass('ui-overlay-autocomplete');return false;},source:function(Request,Response){var URL=Core.Config.Get('Baselink'),Data={Action:'AgentCustomerInformationCenterSearch',Subaction:'SearchCustomerID',IncludeUnknownTicketCustomers:Core.Config.Get('IncludeUnknownTicketCustomers'),Term:Request.term,MaxResults:Core.Config.Get('CustomerIDAutocomplete.MaxResultsDisplayed')};if($Input.data('AutoCompleteXHR')){$Input.data('AutoCompleteXHR').abort();$Input.removeData('AutoCompleteXHR');Response({});}
$Input.data('AutoCompleteXHR',Core.AJAX.FunctionCall(URL,Data,function(Result){var ValueData=[];$Input.removeData('AutoCompleteXHR');$.each(Result,function(){ValueData.push({label:this.Label+' ('+this.Value+')',value:this.Value});});Response(ValueData);}));},select:function(Event,UI){$(Event.target)
.parent()
.find('select')
.append('<option value="'+UI.item.value+'">SelectedItem</option>')
.val(UI.item.value)
.trigger('change');}});};TargetNS.InitCustomerUserAutocomplete=function($Input){$Input.autocomplete({minLength:Core.Config.Get('CustomerUserAutocomplete.MinQueryLength'),delay:Core.Config.Get('CustomerUserAutocomplete.QueryDelay'),open:function(){$(this).autocomplete('widget').addClass('ui-overlay-autocomplete');return false;},source:function(Request,Response){var URL=Core.Config.Get('Baselink'),Data={Action:'AgentCustomerSearch',IncludeUnknownTicketCustomers:Core.Config.Get('IncludeUnknownTicketCustomers'),Term:Request.term,MaxResults:Core.Config.Get('CustomerUserAutocomplete.MaxResultsDisplayed')};if($Input.data('AutoCompleteXHR')){$Input.data('AutoCompleteXHR').abort();$Input.removeData('AutoCompleteXHR');Response({});}
$Input.data('AutoCompleteXHR',Core.AJAX.FunctionCall(URL,Data,function(Result){var ValueData=[];$Input.removeData('AutoCompleteXHR');$.each(Result,function(){ValueData.push({label:this.CustomerValue+" ("+this.CustomerKey+")",value:this.CustomerValue,key:this.CustomerKey});});Response(ValueData);}));},select:function(Event,UI){$(Event.target)
.parent()
.find('select')
.append('<option value="'+UI.item.key+'">SelectedItem</option>')
.val(UI.item.key)
.trigger('change');}});};TargetNS.InitUserAutocomplete=function($Input,Subaction){$Input.autocomplete({minLength:Core.Config.Get('UserAutocomplete.MinQueryLength'),delay:Core.Config.Get('UserAutocomplete.QueryDelay'),open:function(){$(this).autocomplete('widget').addClass('ui-overlay-autocomplete');return false;},source:function(Request,Response){var URL=Core.Config.Get('Baselink'),Data={Action:'AgentUserSearch',Subaction:Subaction,Term:Request.term,MaxResults:Core.Config.Get('UserAutocomplete.MaxResultsDisplayed')};if($Input.data('AutoCompleteXHR')){$Input.data('AutoCompleteXHR').abort();$Input.removeData('AutoCompleteXHR');Response({});}
$Input.data('AutoCompleteXHR',Core.AJAX.FunctionCall(URL,Data,function(Result){var ValueData=[];$Input.removeData('AutoCompleteXHR');$.each(Result,function(){ValueData.push({label:this.UserValue+" ("+this.UserKey+")",value:this.UserValue,key:this.UserKey});});Response(ValueData);}));},select:function(Event,UI){$(Event.target)
.parent()
.find('select')
.append('<option value="'+UI.item.key+'">SelectedItem</option>')
.val(UI.item.key)
.trigger('change');}});};TargetNS.Init=function(){TargetNS.SetAllocationList();};function UpdateAllocationList(Event,UI){var $ContainerObj=$(UI.sender).closest('.AllocationListContainer'),Data={},FieldName;if(Event.type==='sortstop'){$ContainerObj=$(UI.item).closest('.AllocationListContainer');}
Data.Columns={};Data.Order=[];$ContainerObj.find('.AvailableFields').find('li').each(function(){FieldName=$(this).attr('data-fieldname');Data.Columns[FieldName]=0;});$ContainerObj.find('.AssignedFields').find('li').each(function(){FieldName=$(this).attr('data-fieldname');Data.Columns[FieldName]=1;Data.Order.push(FieldName);});$ContainerObj.closest('form').find('.ColumnsJSON').val(Core.JSON.Stringify(Data));}
TargetNS.SetAllocationList=function(ElementID){$('.AllocationListContainer').each(function(){var $ContainerObj=$(this),DataEnabledJSON=$ContainerObj.closest('form.WidgetSettingsForm').find('input.ColumnsEnabledJSON').val(),DataAvailableJSON=$ContainerObj.closest('form.WidgetSettingsForm').find('input.ColumnsAvailableJSON').val(),DataEnabled,DataAvailable,Translation,$FieldObj,IDString='#'+$ContainerObj.find('.AssignedFields').attr('id')+', #'+$ContainerObj.find('.AvailableFields').attr('id'),RegEx;if(typeof ElementID!=='undefined'){RegEx=new RegExp(ElementID.replace('Widget','')+'$');if(!IDString.match(RegEx)){return true;}}
if(DataEnabledJSON){DataEnabled=Core.JSON.Parse(DataEnabledJSON);}
if(DataAvailableJSON){DataAvailable=Core.JSON.Parse(DataAvailableJSON);}
$.each(DataEnabled,function(Index,Field){Translation=Core.Config.Get('Column'+Field)||Field;$FieldObj=$('<li />').attr('title',Translation).attr('data-fieldname',Field).text(Translation);$ContainerObj.find('.AssignedFields').append($FieldObj);});$.each(DataAvailable,function(Index,Field){Translation=Core.Config.Get('Column'+Field)||Field;$FieldObj=$('<li />').attr('title',Translation).attr('data-fieldname',Field).text(Translation);$ContainerObj.find('.AvailableFields').append($FieldObj);});Core.UI.AllocationList.Init(IDString,$ContainerObj.find('.AllocationList'),'UpdateAllocationList','',UpdateAllocationList);Core.UI.Table.InitTableFilter($ContainerObj.find('.FilterAvailableFields'),$ContainerObj.find('.AvailableFields'));});};TargetNS.RegisterUpdatePreferences=function($ClickedElement,ElementID,$Form){if(isJQueryObject($ClickedElement)&&$ClickedElement.length){$ClickedElement.click(function(){var URL=Core.Config.Get('Baselink')+Core.AJAX.SerializeForm($Form);Core.AJAX.ContentUpdate($('#'+ElementID),URL,function(){Core.UI.ToggleTwoContainer($('#'+ElementID+'-setting'),$('#'+ElementID));});return false;});}};return TargetNS;}(Core.Agent.TableFilters||{}));

"use strict";var Core=Core||{};Core.Agent=Core.Agent||{};Core.Agent.LinkObject=(function(TargetNS){TargetNS.RegisterUpdatePreferences=function($ClickedElement,ElementID,$Form){if(isJQueryObject($ClickedElement)&&$ClickedElement.length){$ClickedElement.click(function(){var URL=Core.Config.Get('Baselink')+Core.AJAX.SerializeForm($Form);Core.AJAX.ContentUpdate($('#'+ElementID),URL,function(){Core.UI.ToggleTwoContainer($('#linkobject'+ElementID+'-setting'),$('#'+ElementID));Core.UI.InitWidgetActionToggle();Core.Agent.TableFilters.SetAllocationList(ElementID);});});}
Core.UI.InitWidgetActionToggle();};return TargetNS;}(Core.Agent.LinkObject||{}));

