select
	count(*) as "count",
	avg(array_length(regexp_split_to_array(lettermessage, '\s'),1)) as wordCount
from ltc l
where
	array_length(regexp_split_to_array(lettermessage, '\s'),1) < 100000