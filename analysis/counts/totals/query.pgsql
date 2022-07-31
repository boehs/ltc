select
    count(*),
    (select count(*) from ltc where hidden = true) as hidden,
    (select sum(lettercomments) from ltc) as "theoretical comments",
    (select count(id) from ltccomments) as "comments",
    (select sum(letterup) from ltc) as "upvotes",
    (select count(*) from (select distinct senderip from ltc) as "_") as "authors"
from ltc