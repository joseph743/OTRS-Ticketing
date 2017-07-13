CREATE DEFINER=`otrs`@`localhost` TRIGGER `otrs`.`article_BEFORE_INSERT` BEFORE INSERT ON `article` 
FOR EACH ROW
BEGIN
  -- declare idt int;
   
  -- update article set ticket_id=idt  where id=NEW.id;
  SET @eliaid = (Select max(ticket_id) From article where a_subject=NEW.a_subject);
  
  SET @ticketstateid = (SELECT ticket.ticket_state_id FROM ticket
						INNER JOIN article ON article.ticket_id = ticket.id where title=new.a_subject order by ticket.id DESC limit 1);
  
 insert into log(eliasid,subject)values(@ticketstateid,@eliaid);
  
 if @eliaid is null  THEN set new.ticket_id = new.ticket_id ;
   
   else 
   
   if new.article_type_id=1 and (@ticketstateid=1 or @ticketstateid=4 or @ticketstateid=10 or @ticketstateid=11) then SET NEW.ticket_id = @eliaid;
   
		 
--  insert into log(eliasid,subject)values(new.article_type_id,@eliaid);
  end if;
  end if;

  -- if NEW.ticket_id is null THEN set new.ticket_id =5;
   -- SET NEW.ticket_id= (Select id From ticket where title=NEW.a_subject );
  -- END if;

END