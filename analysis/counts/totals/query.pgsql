select
    count(*),
    (select count(*) from ltc where hidden = true) as hidden
from ltc