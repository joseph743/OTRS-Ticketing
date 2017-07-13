"use strict";var Core=Core||{};Core.Agent=Core.Agent||{};Core.Agent.CustomerSearch=(function(TargetNS){var BackupData={CustomerInfo:'',CustomerEmail:'',CustomerKey:''},CustomerFieldChangeRunCount={};function GetCustomerInfo(CustomerUserID){var Data={Action:'AgentCustomerSearch',Subaction:'CustomerInfo',CustomerUserID:CustomerUserID};Core.AJAX.FunctionCall(Core.Config.Get('Baselink'),Data,function(Response){$('#CustomerID').val(Response.CustomerID);$('#ShowCustomerID').html(Response.CustomerID);Core.App.Publish('Event.Agent.CustomerSearch.GetCustomerInfo.Callback',[Response.CustomerID]);$('#CustomerInfo .Content').html(Response.CustomerTableHTMLString);if(Core.Config.Get('Action')==='AgentTicketEmail'||Core.Config.Get('Action')==='AgentTicketPhone'){$('#ServiceID').attr('selectedIndex',0);Core.AJAX.FormUpdate($('#CustomerID').closest('form'),'AJAXUpdate','ServiceID',['Dest','SelectedCustomerUser','NextStateID','PriorityID','ServiceID','SLAID','CryptKeyID','OwnerAll','ResponsibleAll','TicketFreeText1','TicketFreeText2','TicketFreeText3','TicketFreeText4','TicketFreeText5','TicketFreeText6','TicketFreeText7','TicketFreeText8','TicketFreeText9','TicketFreeText10','TicketFreeText11','TicketFreeText12','TicketFreeText13','TicketFreeText14','TicketFreeText15','TicketFreeText16']);}
if(Core.Config.Get('Action')==='AgentTicketProcess'){$('#ServiceID').attr('selectedIndex',0);Core.AJAX.FormUpdate($('#CustomerID').closest('form'),'AJAXUpdate','ServiceID',Core.Config.Get('ProcessManagement.UpdatableFields'));}});}
function GetCustomerTickets(CustomerUserID,CustomerID){var Data={Action:'AgentCustomerSearch',Subaction:'CustomerTickets',CustomerUserID:CustomerUserID,CustomerID:CustomerID};if(!parseInt(Core.Config.Get('CustomerSearch.ShowCustomerTickets'),10)){return;}
function CustomerHistoryEvents(){$('select[name=ResponseID]').on('change',function(){var URL;if($(this).val()>0){URL=Core.Config.Get('Baselink')+$(this).parents().serialize();Core.UI.Popup.OpenPopup(URL,'TicketAction');$(this).val('0');}});$('select[name=ResponseID]').on('click',function(Event){Event.stopPropagation();return false;});$('#CustomerTickets .MasterAction').on('click',function(Event){var $MasterActionLink=$(this).find('a.MasterActionLink');if($(Event.target).hasClass('InputField_Search')){return true;}
if(Core.Config.Get('Action')==='AgentTicketCustomer'){Core.UI.Popup.ExecuteInParentWindow(function(WindowObject){WindowObject.Core.UI.Popup.FirePopupEvent('URL',{URL:$MasterActionLink.attr('href')});});Core.UI.Popup.ClosePopup();return false;}
else{if(Event.target!==$MasterActionLink.get(0)){window.location=$MasterActionLink.attr('href');return false;}}});$("#SortBy").off('change').on('change',function(){var SortedData,Selection=$(this).val().split('|');if(Selection.length===2){SortedData={Action:'AgentCustomerSearch',Subaction:'CustomerTickets',CustomerUserID:CustomerUserID,CustomerID:CustomerID,SortBy:Selection[0],OrderBy:Selection[1]};Core.AJAX.FunctionCall(Core.Config.Get('Baselink'),SortedData,function(Response){if($('#CustomerTickets').length){$('#CustomerTickets').html(Response.CustomerTicketsHTMLString);ReplaceCustomerTicketLinks();}});}});Core.UI.InputFields.Activate();}
function ReplaceCustomerTicketLinks(){$('#CustomerTickets').find('.AriaRoleMain').removeAttr('role').removeClass('AriaRoleMain');$('#CustomerTickets').find('.OverviewZoom a, .Pagination a, .TableSmall th a').click(function(){var Link=$(this).attr('href'),URLComponents;URLComponents=Link.split('?',2);Core.AJAX.FunctionCall(URLComponents[0],URLComponents[1],function(Response){if($('#CustomerTickets').length){$('#CustomerTickets').html(Response.CustomerTicketsHTMLString);ReplaceCustomerTicketLinks();}});return false;});Core.UI.Accordion.Init($('.Preview > ul'),'li h3 a','.HiddenBlock');if(Core.Config.Get('Action')==='AgentTicketPhone'||Core.Config.Get('Action')==='AgentTicketEmail'||Core.Config.Get('Action')==='AgentTicketCustomer')
{CustomerHistoryEvents();}
return false;}
Core.AJAX.FunctionCall(Core.Config.Get('Baselink'),Data,function(Response){if($('#CustomerTickets').length){$('#CustomerTickets').html(Response.CustomerTicketsHTMLString);ReplaceCustomerTicketLinks();}});}
function CheckPhoneCustomerCountLimit(){if(Core.Config.Get('Action')!=='AgentTicketPhone'){return;}
if(Core.Config.Get('Ticket::Frontend::AgentTicketPhone::AllowMultipleFrom')==="1"){return;}
if($('#TicketCustomerContentFromCustomer input.CustomerTicketText').length>0){$('#FromCustomer').val('').prop('disabled',true).prop('readonly',true);$('#Dest').trigger('focus');}
else{$('#FromCustomer').val('').prop('disabled',false).prop('readonly',false);}}
TargetNS.Init=function($Element){if(Core.Config.Get('Action')==='AgentTicketCustomer'){GetCustomerTickets($('#CustomerAutoComplete').val(),$('#CustomerID').val());$Element.blur(function(){if($Element.val()===''){TargetNS.ResetCustomerInfo();$('#CustomerTickets').empty();}});}
if((Core.Config.Get('Action')==='AgentTicketEmail'||Core.Config.Get('Action')==='AgentTicketPhone')&&$('#SelectedCustomerUser').val()!==''){GetCustomerTickets($('#SelectedCustomerUser').val());}
if($('#CustomerInfo').length){BackupData.CustomerInfo=$('#CustomerInfo .Content').html();}
if(isJQueryObject($Element)){$Element.unbind('keyup.Validate').bind('keyup.Validate',function(){var Value=$Element.val();if($Element.hasClass('ServerError')&&Value.length){$('#OTRS_UI_Tooltips_ErrorTooltip').hide();}});Core.UI.Autocomplete.Init($Element,function(Request,Response){var URL=Core.Config.Get('Baselink'),Data={Action:'AgentCustomerSearch',Term:Request.term,MaxResults:Core.UI.Autocomplete.GetConfig('MaxResultsDisplayed')};$Element.data('AutoCompleteXHR',Core.AJAX.FunctionCall(URL,Data,function(Result){var ValueData=[];$Element.removeData('AutoCompleteXHR');$.each(Result,function(){ValueData.push({label:this.CustomerValue+" ("+this.CustomerKey+")",value:this.CustomerValue,key:this.CustomerKey});});Response(ValueData);}));},function(Event,UI){var CustomerKey=UI.item.key,CustomerValue=UI.item.value;BackupData.CustomerKey=CustomerKey;BackupData.CustomerEmail=CustomerValue;if(Core.Config.Get('Action')==='AgentBook'){$(Event.target).val(CustomerValue);return false;}
$Element.val(CustomerValue);if(Core.Config.Get('Action')==='AgentTicketEmail'||Core.Config.Get('Action')==='AgentTicketCompose'||Core.Config.Get('Action')==='AgentTicketForward'||Core.Config.Get('Action')==='AgentTicketEmailOutbound'){$Element.val('');}
if(Core.Config.Get('Action')!=='AgentTicketPhone'&&Core.Config.Get('Action')!=='AgentTicketEmail'&&Core.Config.Get('Action')!=='AgentTicketCompose'&&Core.Config.Get('Action')!=='AgentTicketForward'&&Core.Config.Get('Action')!=='AgentTicketEmailOutbound'){$('#SelectedCustomerUser').val(CustomerKey);if($('#CustomerUserID').length){$('#CustomerUserID').val(CustomerKey);if($('#CustomerUserOption').length){$('#CustomerUserOption').val(CustomerKey);}
else{$('<input type="hidden" name="CustomerUserOption" id="CustomerUserOption">').val(CustomerKey).appendTo($Element.closest('form'));}}
GetCustomerTickets(CustomerKey);GetCustomerInfo(CustomerKey);}
else{TargetNS.AddTicketCustomer($(Event.target).attr('id'),CustomerValue,CustomerKey);}},'CustomerSearch');if(Core.Config.Get('Action')!=='AgentTicketCustomer'&&Core.Config.Get('Action')!=='AgentTicketPhone'&&Core.Config.Get('Action')!=='AgentTicketEmail'&&Core.Config.Get('Action')!=='AgentTicketCompose'&&Core.Config.Get('Action')!=='AgentTicketForward'&&Core.Config.Get('Action')!=='AgentTicketEmailOutbound'){$Element.blur(function(){var FieldValue=$(this).val();if(FieldValue!==BackupData.CustomerEmail&&FieldValue!==BackupData.CustomerKey){$('#SelectedCustomerUser').val('');$('#CustomerUserID').val('');$('#CustomerID').val('');$('#CustomerUserOption').val('');$('#ShowCustomerID').html('');$('#CustomerInfo .Content').html(BackupData.CustomerInfo);if(Core.Config.Get('Action')==='AgentTicketProcess'){Core.AJAX.FormUpdate($('#CustomerID').closest('form'),'AJAXUpdate','ServiceID',Core.Config.Get('ProcessManagement.UpdatableFields'));}}});}
else{TargetNS.InitCustomerField();}}
$(window).bind('beforeunload.CustomerSearch',function(){$('#SelectedCustomerUser').val('');return;});CheckPhoneCustomerCountLimit();};function htmlDecode(Text){return Text.replace(/&amp;/g,'&');}
TargetNS.AddTicketCustomer=function(Field,CustomerValue,CustomerKey,SetAsTicketCustomer){var $Clone=$('.CustomerTicketTemplate'+Field).clone(),CustomerTicketCounter=$('#CustomerTicketCounter'+Field).val(),TicketCustomerIDs=0,IsDuplicated=false,Suffix;if(typeof CustomerKey!=='undefined'){CustomerKey=htmlDecode(CustomerKey);}
if(CustomerValue===''){return false;}
$('[class*=CustomerTicketText]').each(function(){if($(this).val()===CustomerValue){IsDuplicated=true;}});if(IsDuplicated){TargetNS.ShowDuplicatedDialog(Field);return false;}
TicketCustomerIDs=$('.CustomerContainer input[type="radio"]').length;CustomerTicketCounter++;Suffix='_'+CustomerTicketCounter;$Clone.removeClass('Hidden CustomerTicketTemplate'+Field);$Clone.find(':input, a').each(function(){var ID=$(this).attr('id');$(this).attr('id',ID+Suffix);$(this).val(CustomerValue);if(ID!=='CustomerSelected'){$(this).attr('name',ID+Suffix);}
if($(this).hasClass('CustomerTicketRadio')){if(TicketCustomerIDs===0){$(this).prop('checked',true);}
$(this).val(CustomerTicketCounter);$(this).bind('change',function(){if($(this).prop('checked')){TargetNS.ReloadCustomerInfo(CustomerKey);}
return false;});}
if($(this).hasClass('CustomerKey')){$(this).val(CustomerKey);}
if($(this).hasClass('RemoveButton')){$(this).bind('click',function(){TargetNS.RemoveCustomerTicket($(this));if($('#TicketCustomerContent'+Field+' .CustomerTicketRadio').length===0){$('#CustomerTickets').empty();}
return false;});$(this).val(CustomerValue);}});$('#TicketCustomerContent'+Field).parent().removeClass('Hidden');$('#TicketCustomerContent'+Field).append($Clone);$('#CustomerTicketCounter'+Field).val(CustomerTicketCounter);if((CustomerKey!==''&&TicketCustomerIDs===0&&(Field==='ToCustomer'||Field==='FromCustomer'))||SetAsTicketCustomer){if(SetAsTicketCustomer){$('#CustomerSelected_'+CustomerTicketCounter).prop('checked',true).trigger('change');}
else{$('.CustomerContainer input[type="radio"]:first').prop('checked',true).trigger('change');}}
$('#'+Field).val('').focus();CheckPhoneCustomerCountLimit();if((Core.Config.Get('Action')==='AgentTicketEmail'||Core.Config.Get('Action')==='AgentTicketCompose'||Core.Config.Get('Action')==='AgentTicketForward'||Core.Config.Get('Action')==='AgentTicketEmailOutbound')&&$('#CryptKeyID').length){Core.AJAX.FormUpdate($('#'+Field).closest('form'),'AJAXUpdate','',['CryptKeyID']);}
$('#FromCustomer, #ToCustomer')
.removeClass('Error ServerError')
.closest('.Field')
.prev('label')
.removeClass('LabelError');Core.Form.ErrorTooltips.HideTooltip();return false;};TargetNS.RemoveCustomerTicket=function(Object){var TicketCustomerIDs=0,$Field=Object.closest('.Field'),$Form;if(Core.Config.Get('Action')==='AgentTicketEmail'||Core.Config.Get('Action')==='AgentTicketCompose'||Core.Config.Get('Action')==='AgentTicketForward'||Core.Config.Get('Action')==='AgentTicketEmailOutbound'){$Form=Object.closest('form');}
Object.parent().remove();TicketCustomerIDs=$('.CustomerContainer input[type="radio"]').length;if(TicketCustomerIDs===0){TargetNS.ResetCustomerInfo();}
if((Core.Config.Get('Action')==='AgentTicketEmail'||Core.Config.Get('Action')==='AgentTicketCompose'||Core.Config.Get('Action')==='AgentTicketForward'||Core.Config.Get('Action')==='AgentTicketEmailOutbound')&&$('#CryptKeyID').length){Core.AJAX.FormUpdate($Form,'AJAXUpdate','',['CryptKeyID']);}
if(!$('.CustomerContainer input[type="radio"]').is(':checked')){$('.CustomerContainer input[type="radio"]:first').prop('checked',true).trigger('change');}
if($Field.find('.CustomerTicketText:visible').length===0){$Field.addClass('Hidden');}
CheckPhoneCustomerCountLimit();};TargetNS.ResetCustomerInfo=function(){$('#SelectedCustomerUser').val('');$('#CustomerUserID').val('');$('#CustomerID').val('');$('#CustomerUserOption').val('');$('#ShowCustomerID').html('');$('#CustomerInfo .Content').html(Core.Config.Get('TextNone'));};TargetNS.ReloadCustomerInfo=function(CustomerKey){GetCustomerTickets(CustomerKey);GetCustomerInfo(CustomerKey);$('#SelectedCustomerUser').val(CustomerKey);};TargetNS.InitCustomerField=function(){$('.CustomerAutoComplete').each(function(){var ObjectId=$(this).attr('id');$('#'+ObjectId).bind('change',function(){if(!$('#'+ObjectId).val()||$('#'+ObjectId).val()===''){return false;}
if(!Core.UI.Autocomplete.GetConfig('ActiveAutoComplete')){if(typeof CustomerFieldChangeRunCount[ObjectId]==='undefined'){CustomerFieldChangeRunCount[ObjectId]=1;}
else{CustomerFieldChangeRunCount[ObjectId]++;}
if(Core.UI.Autocomplete.SearchButtonClicked[ObjectId]){delete CustomerFieldChangeRunCount[ObjectId];delete Core.UI.Autocomplete.SearchButtonClicked[ObjectId];return false;}
else{if(CustomerFieldChangeRunCount[ObjectId]===1){window.setTimeout(function(){$('#'+ObjectId).trigger('change');},200);return false;}
delete CustomerFieldChangeRunCount[ObjectId];}}
if($(this).autocomplete("widget").is(':visible')){window.setTimeout(function(){$('#'+ObjectId).trigger('change');},200);return false;}
Core.Agent.CustomerSearch.AddTicketCustomer(ObjectId,$('#'+ObjectId).val());return false;});$('#'+ObjectId).bind('keypress',function(e){if(e.which===13){Core.Agent.CustomerSearch.AddTicketCustomer(ObjectId,$('#'+ObjectId).val());return false;}});});};TargetNS.ShowDuplicatedDialog=function(Field){Core.UI.Dialog.ShowAlert(Core.Config.Get('Duplicated.TitleText'),Core.Config.Get('Duplicated.ContentText')+' '+Core.Config.Get('Duplicated.RemoveText'),function(){Core.UI.Dialog.CloseDialog($('.Alert'));$('#'+Field).val('');$('#'+Field).focus();return false;});};return TargetNS;}(Core.Agent.CustomerSearch||{}));

"use strict";var Core=Core||{};Core.Agent=Core.Agent||{};Core.Agent.TicketAction=(function(TargetNS){function SerializeData(Data){var QueryString='';$.each(Data,function(Key,Value){QueryString+=';'+encodeURIComponent(Key)+'='+encodeURIComponent(Value);});return QueryString;}
function OpenSpellChecker(){var SpellCheckIFrame,SpellCheckIFrameURL;SpellCheckIFrameURL=Core.Config.Get('CGIHandle')+'?Action=AgentSpelling;Field=RichText;Body='+encodeURIComponent($('#RichText').val());SpellCheckIFrameURL+=SerializeData(Core.App.GetSessionInformation());SpellCheckIFrame='<iframe class="TextOption SpellCheck" src="'+SpellCheckIFrameURL+'"></iframe>';Core.UI.Dialog.ShowContentDialog(SpellCheckIFrame,'','10px','Center',true);}
function OpenAddressBook(){var AddressBookIFrameURL,AddressBookIFrame;AddressBookIFrameURL=Core.Config.Get('CGIHandle')+
'?Action=AgentBook;ToCustomer='+encodeURIComponent($('#CustomerAutoComplete, #ToCustomer').val())+
';CcCustomer='+encodeURIComponent($('#Cc, #CcCustomer').val())+
';BccCustomer='+encodeURIComponent($('#Bcc, #BccCustomer').val());AddressBookIFrameURL+=SerializeData(Core.App.GetSessionInformation());AddressBookIFrame='<iframe class="TextOption" src="'+AddressBookIFrameURL+'"></iframe>';Core.UI.Dialog.ShowContentDialog(AddressBookIFrame,'','10px','Center',true);}
function OpenCustomerDialog(){var CustomerIFrameURL,CustomerIFrame;CustomerIFrameURL=Core.Config.Get('CGIHandle')+'?Action=AdminCustomerUser;Nav=None;Subject=;What=';CustomerIFrameURL+=SerializeData(Core.App.GetSessionInformation());CustomerIFrame='<iframe class="TextOption Customer" src="'+CustomerIFrameURL+'"></iframe>';Core.UI.Dialog.ShowContentDialog(CustomerIFrame,'','10px','Center',true);}
function AddMailAddress($Link){var $Element=$('#'+$Link.attr('rel')),NewValue=$Element.val(),NewData,NewDataItem,Length;if(NewValue.length){NewValue=NewValue+', ';}
NewValue=NewValue+
Core.Data.Get($Link.closest('tr'),'Email')
.replace(/&quot;/g,'"')
.replace(/&lt;/g,'<')
.replace(/&gt;/g,'>');$Element.val(NewValue);Length=$Element.val().length;$Element.focus();$Element[0].setSelectionRange(Length,Length);if($Link.attr('rel')==='ToCustomer'&&Core.Config.Get('CustomerInfoSet')){NewData=$('#CustomerData').val();NewDataItem=Core.Data.Get($Link.closest('a'),'customerdatajson');if(NewData){NewData=Core.JSON.Parse(NewData);$.each(NewDataItem,function(CustomerMail,CustomerKey){NewData[CustomerMail]=CustomerKey;});$('#CustomerData').val(Core.JSON.Stringify(NewData));}
else
{$('#CustomerData').val(Core.JSON.Stringify(NewDataItem));}}}
function MarkPrimaryCustomer(){$('.CustomerContainer').children('div').each(function(){var $InputObj=$(this).find('.CustomerTicketText'),$RadioObj=$(this).find('.CustomerTicketRadio');if($RadioObj.prop('checked')){$InputObj.addClass('MainCustomer');}
else{$InputObj.removeClass('MainCustomer');}});}
TargetNS.Init=function(){$('#OptionSpellCheck').bind('click',function(){OpenSpellChecker();return false;});$('#OptionAddressBook').bind('click',function(){OpenAddressBook();return false;});$('#OptionCustomer').bind('click',function(){OpenCustomerDialog();return false;});if(parseInt(Core.Config.Get('SpellChecker'),10)===1&&parseInt(Core.Config.Get('NeedSpellCheck'),10)===1){Core.Config.Set('TextIsSpellChecked',false);$('#RichTextField, .RichTextField').on('click','.cke_button__spellcheck',function(){Core.Config.Set('TextIsSpellChecked',true);});$('#OptionSpellCheck').bind('click',function(){Core.Config.Set('TextIsSpellChecked',true);});if(parseInt(Core.Config.Get('RichTextSet'),10)===0){$('#RichTextField, .RichTextField').on('change','#RichText',function(){Core.Config.Set('TextIsSpellChecked',false);});}
Core.Form.Validate.SetSubmitFunction($('form[name=compose]'),function(){if($('#RichText').val()&&!$('#RichText').hasClass('ValidationIgnore')&&!Core.Config.Get('TextIsSpellChecked')){Core.App.Publish('Event.Agent.TicketAction.NeedSpellCheck',[$('#RichText')]);Core.UI.Dialog.ShowContentDialog('<p>'+Core.Config.Get('SpellCheckNeededMsg')+'</p>','','150px','Center',true,[{Label:'<span>'+Core.Config.Get('DialogCloseMsg')+'</span>',Function:function(){Core.UI.Dialog.CloseDialog($('.Dialog:visible'));Core.Form.EnableForm($('#RichText').closest('form'));},Class:'Primary'}]);return false;}
$('#RichText').closest('form').get(0).submit();});}
MarkPrimaryCustomer();Core.App.Subscribe('Event.Agent.CustomerSearch.GetCustomerInfo.Callback',function(){MarkPrimaryCustomer();});$('#submitRichText').on('click',function(Event){var ToCustomer=$('#ToCustomer').val()||'',CcCustomer=$('#CcCustomer').val()||'',BccCustomer=$('#BccCustomer').val()||'',FromCustomer=$('#FromCustomer').val()||'';if(ToCustomer.length||CcCustomer.length||BccCustomer.length||FromCustomer.length){window.setTimeout(function(){$('#submitRichText').trigger('click');},100);Event.preventDefault();Event.stopPropagation();return false;}});Core.App.Subscribe('Event.UI.ToggleWidget',function($WidgetElement){if($WidgetElement.attr('id')!=='WidgetArticle'){return;}
if($WidgetElement.hasClass('Expanded')){$('#CreateArticle').prop('checked',true);}});Core.App.Subscribe('Event.Agent.TicketAction.NeedSpellCheck',function($TextElement){var $Widget=$TextElement.closest('div.WidgetSimple');if($Widget.attr('id')!=='WidgetArticle'||$Widget.hasClass('Expanded')){return;}
$Widget.find('div.WidgetAction.Toggle > a').trigger('click');});};TargetNS.InitAddressBook=function(){$('#SearchResult a').bind('click',function(){AddMailAddress($(this));return false;});$('#Apply').bind('click',function(){var $To,$Cc,$Bcc,CustomerData;if($('#CustomerAutoComplete',parent.document).length){$To=$('#CustomerAutoComplete',parent.document);$Cc=$('#Cc',parent.document);$Bcc=$('#Bcc',parent.document);$To.val($('#ToCustomer').val());$Cc.val($('#CcCustomer').val());$Bcc.val($('#BccCustomer').val());}
else{$To=$('#ToCustomer',parent.document);$Cc=$('#CcCustomer',parent.document);$Bcc=$('#BccCustomer',parent.document);if($('#CustomerData').val()){CustomerData=Core.JSON.Parse($('#CustomerData').val());$.each(CustomerData,function(CustomerMail,CustomerKey){$To.val(CustomerMail);parent.Core.Agent.CustomerSearch.AddTicketCustomer('ToCustomer',CustomerMail,CustomerKey);});}
else{$.each($('#ToCustomer').val().split(/, ?/),function(Index,Value){$To.val(Value);parent.Core.Agent.CustomerSearch.AddTicketCustomer('ToCustomer',Value);});}
$.each($('#CcCustomer').val().split(/, ?/),function(Index,Value){$Cc.val(Value);parent.Core.Agent.CustomerSearch.AddTicketCustomer('CcCustomer',Value);});$.each($('#BccCustomer').val().split(/, ?/),function(Index,Value){$Bcc.val(Value);parent.Core.Agent.CustomerSearch.AddTicketCustomer('BccCustomer',Value);});}
parent.Core.UI.Dialog.CloseDialog($('.Dialog',parent.document));});$('#Cancel').bind('click',function(){parent.Core.UI.Dialog.CloseDialog($('.Dialog',parent.document));});};TargetNS.InitSpellCheck=function(){$('#SpellCheck select, #SpellCheck input[type="text"]').bind('change',function(){var $Row=$(this).closest('tr'),RowCount=parseInt($Row.attr('id').replace(/Row/,''),10);$Row.find('input[type="radio"][id=ChangeWord'+RowCount+']').prop('checked',true);});$('#Apply').bind('click',function(){var FieldName=$('#Field').val(),$Body=$('#'+FieldName,parent.document);$Body.val($('#Body').val());parent.Core.UI.Dialog.CloseDialog($('.Dialog',parent.document));});$('#Cancel').bind('click',function(){parent.Core.UI.Dialog.CloseDialog($('.Dialog',parent.document));});};TargetNS.UpdateCustomer=function(Customer){var $UpdateForm=$('form[name=compose]',parent.document);$UpdateForm
.find('#ExpandCustomerName').val('2')
.end()
.find('#PreSelectedCustomerUser').val(Customer)
.end()
.submit();parent.Core.UI.Dialog.CloseDialog($('.Dialog',parent.document));};TargetNS.SelectRadioButton=function(Value,Name){$('input[type="radio"][name='+Name+'][value='+Value+']').prop('checked',true);};TargetNS.ConfirmTemplateOverwrite=function(FieldName,$TemplateSelect,Callback){var Content='',LastValue=$TemplateSelect.data('LastValue')||'';Content=$('#'+FieldName).val();if(typeof CKEDITOR!=='undefined'&&CKEDITOR.instances[FieldName]){Content=CKEDITOR.instances[FieldName].getData();}
if(Content.length&&!window.confirm(Core.Config.Get('TicketActionTemplateOverwrite')+' '+Core.Config.Get('TicketActionTemplateOverwriteConfirm')))
{$TemplateSelect.val(LastValue).trigger('redraw');}
else if($.isFunction(Callback)){Callback();$TemplateSelect.data('LastValue',$TemplateSelect.val());}}
return TargetNS;}(Core.Agent.TicketAction||{}));

