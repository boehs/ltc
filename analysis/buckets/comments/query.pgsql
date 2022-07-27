select * from (
	select
		count(*),
		round(avg(letterup)) as "upvotes",
		lettercomments as "bucket"
	from ltc l
	group by "bucket"
) as "_"
where not ("count" < 3 and "bucket" > 0)
order by
	case
		when "bucket" is null then 1
	end,
	"bucket"