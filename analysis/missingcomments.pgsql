select
    id,
    lettercomments,
    (select count(*) from ltc e where e.id = id)
from ltc l
where 
    lettercomments != (select count(*) from ltccomments where letterid = l.id)
    and lettercomments > 0
order by id
limit 500