# OTRS config file (automatically generated)
# VERSION:1.1
package Kernel::Config::Files::ZZZACL;
use strict;
use warnings;
no warnings 'redefine';
use utf8;
sub Load {
    my ($File, $Self) = @_;

# Created: 2017-05-11 09:30:29 (joseph.elia)
# Changed: 2017-05-22 08:27:29 (joseph.elia)
$Self->{TicketAcl}->{'BS Problems'} = {
  'Possible' => {
    'Ticket' => {
      'DynamicField_SubNote' => [
        '[RegExp]10[0-9][0-9][0-9]'
      ]
    }
  },
  'PossibleAdd' => {},
  'PossibleNot' => {},
  'Properties' => {
    'DynamicField' => {
      'DynamicField_ticketarticle' => [
        '2'
      ]
    }
  },
  'PropertiesDatabase' => {},
  'StopAfterMatch' => 0
};

# Created: 2017-05-29 10:21:10 (joseph.elia)
# Changed: 2017-05-29 10:23:25 (joseph.elia)
$Self->{TicketAcl}->{'Congestion'} = {
  'Possible' => {
    'Ticket' => {
      'DynamicField_SubNote' => [
        '[RegExp]40[0-9][0-9][0-9]'
      ]
    }
  },
  'PossibleAdd' => {},
  'PossibleNot' => {},
  'Properties' => {
    'DynamicField' => {
      'DynamicField_ticketarticle' => [
        '4'
      ]
    }
  },
  'PropertiesDatabase' => {},
  'StopAfterMatch' => 0
};

# Created: 2017-05-17 08:12:27 (joseph.elia)
# Changed: 2017-05-17 08:15:54 (joseph.elia)
$Self->{TicketAcl}->{'DSL account'} = {
  'Possible' => {
    'Ticket' => {
      'DynamicField_SubNote' => [
        '[RegExp]30[0-9][0-9][0-9]'
      ]
    }
  },
  'PossibleAdd' => {},
  'PossibleNot' => {},
  'Properties' => {
    'DynamicField' => {
      'DynamicField_ticketarticle' => [
        '5'
      ]
    }
  },
  'PropertiesDatabase' => {},
  'StopAfterMatch' => 0
};

# Created: 2017-05-09 13:57:58 (joseph.elia)
# Changed: 2017-05-11 09:30:18 (joseph.elia)
$Self->{TicketAcl}->{'transmission issue'} = {
  'Possible' => {
    'Ticket' => {
      'DynamicField_SubNote' => [
        '[RegExp]20[0-9][0-9][0-9]'
      ]
    }
  },
  'PossibleAdd' => {},
  'PossibleNot' => {},
  'Properties' => {
    'DynamicField' => {
      'DynamicField_ticketarticle' => [
        '17'
      ]
    }
  },
  'PropertiesDatabase' => {},
  'StopAfterMatch' => 0
};

}
1;
