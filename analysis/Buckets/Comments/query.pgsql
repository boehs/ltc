select
	count(*),
	round(avg(letterup)) as "upvotes",
	(round(lettercomments / 10) * 10) as "bucket"
from ltc l 
group by "bucket"
order by "count" desc, "bucket"