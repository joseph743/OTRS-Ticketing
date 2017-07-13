# OTRS config file (automatically generated)
# VERSION:1.1
package Kernel::Config::Files::ZZZAuto;
use strict;
use warnings;
no warnings 'redefine';
use utf8;
sub Load {
    my ($File, $Self) = @_;
$Self->{'Ticket::Frontend::AgentTicketOwner'}->{'DynamicField'} =  {
  'noteticket' => '2'
};
$Self->{'Ticket::Frontend::AgentTicketNote'}->{'DynamicField'} =  {
  'SubNote' => '2',
  'ticketarticle' => '2'
};
$Self->{'Ticket::Frontend::AgentTicketEmailOutbound'}->{'DynamicField'} =  {
  'ticketarticle' => '2'
};
$Self->{'Ticket::Frontend::AgentTicketFreeText'}->{'DynamicField'} =  {
  'noteticket' => '2'
};
$Self->{'Ticket::Frontend::AgentTicketEmail'}->{'DynamicField'} =  {
  'noteticket' => '2'
};
$Self->{'Ticket::Frontend::AutomaticMergeText'} =  '<OTRS_MERGE_TO_TICKET>';
delete $Self->{'Ticket::Frontend::AgentTicketBulk'}->{'Priority'};
$Self->{'Ticket::Frontend::AgentTicketOwner'}->{'NoteMandatory'} =  '0';
$Self->{'Ticket::Frontend::AgentTicketOwner'}->{'Note'} =  '0';
$Self->{'Ticket::Frontend::AgentTicketNote'}->{'State'} =  '1';
$Self->{'Daemon::SchedulerCronTaskManager::Task'}->{'MailAccountFetch'} =  {
  'Function' => 'Execute',
  'MaximumParallelInstances' => '1',
  'Module' => 'Kernel::System::Console::Command::Maint::PostMaster::MailAccountFetch',
  'Params' => [],
  'Schedule' => '*/1 * * * *',
  'TaskName' => 'MailAccountFetch'
};
delete $Self->{'PreferencesGroups'}->{'SpellDict'};
$Self->{'NotificationBodyLostPassword'} =  'Hi <OTRS_USERFIRSTNAME>,


Here\'s your new OTRS password.

New password: <OTRS_NEWPW>

You can log in via the following URL:

<OTRS_CONFIG_HttpType>://<OTRS_CONFIG_FQDN>/<OTRS_CONFIG_ScriptAlias>index.pl';
$Self->{'NotificationBodyLostPasswordToken'} =  'Hi <OTRS_USERFIRSTNAME>,

You or someone impersonating you has requested to change your OTRS
password.

If you want to do this, click on the link below. You will receive another email containing the password.

<OTRS_CONFIG_HttpType>://<OTRS_CONFIG_FQDN>/<OTRS_CONFIG_ScriptAlias>index.pl?Action=LostPassword;Token=<OTRS_TOKEN>

If you did not request a new password, please ignore this email.';
$Self->{'AgentLogo'} =  {
  'StyleHeight' => '85px',
  'StyleRight' => '38px',
  'StyleTop' => '4px',
  'StyleWidth' => '270px',
  'URL' => 'skins/Agent/default/img/logo_gds.png'
};
$Self->{'AdminEmail'} =  'elias.abouhamad@idm.net.lb';
delete $Self->{'NodeID'};
$Self->{'FQDN'} =  'Noc-App.idm.net.lb';
$Self->{'SystemID'} =  '27';
$Self->{'SecureMode'} =  1;
}
1;
