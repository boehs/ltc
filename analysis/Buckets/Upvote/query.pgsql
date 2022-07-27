select
	count(*),
	trim_scale((round(avg(lettercomments) * 10) / 10)) as "comments",
	(round(letterup / 10) * 10) as "bucket"
from ltc l 
group by (round(letterup / 10) * 10)
order by "count" desc, "bucket"