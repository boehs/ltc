select
	count(*) as "count",
	text(extract(year from letterpostdate)) || '/' || text(extract(month from letterpostdate)) as "date"
from ltc l
group by (extract(year from letterpostdate)), (extract(month from letterpostdate))
order by (extract(year from letterpostdate)), (extract(month from letterpostdate))