select
	count(*) as "count",
	(round((array_length(regexp_split_to_array(lettermessage, '\s'),1)) / 10 ) * 10) as wordCount
from ltc l
group by wordCount
order by wordCount