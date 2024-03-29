select
	count(*) as "count",
	sum(letterup) as "upvotes",
	sum(lettercomments) as "comments",
	count(*) filter (where letterlevel > 0) as "featured",
	count(*) filter (where hidden) as "hidden",
	text(extract(year from letterpostdate)) || '/' || text(extract(month from letterpostdate)) as "date"
from ltc l
group by (extract(year from letterpostdate)), (extract(month from letterpostdate))
order by (extract(year from letterpostdate)), (extract(month from letterpostdate))