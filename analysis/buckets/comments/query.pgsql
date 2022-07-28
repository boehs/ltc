select * from (
	select
		count(*),
		round(avg(letterup)) as "upvotes",
		lettercomments as "bucket"
	from ltc l
	group by "bucket"
) as "_"
order by
	case
		when "bucket" is null then 1
	end,
	"bucket"