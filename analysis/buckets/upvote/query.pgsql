select
	count(*),
	trim_scale((round(avg(lettercomments) * 10) / 10)) as "comments",
	(round(letterup / 10) * 10) as "bucket"
from ltc l 
group by "bucket"
order by "count" desc, "bucket"