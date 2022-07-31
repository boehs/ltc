select
    id,
    lettercomments
from ltc
where 
    lettercomments != (select count(*) from ltccomments where letterid = ltc.id)
    and lettercomments > 0
order by id