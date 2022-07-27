/* For scrapping hidden letter */

select allid as missing_ids
from generate_series((select min(id) from ltc), (select max(id) from ltc)) allid
except 
select id from ltc
order by missing_ids