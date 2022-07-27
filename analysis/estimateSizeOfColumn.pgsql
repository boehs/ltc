select
	pg_size_pretty(sum(pg_column_size(lettermessage))) as total,
	pg_size_pretty(avg(pg_column_size(lettermessage))) as average,
	sum(pg_column_size(lettermessage)) * 100.0 / pg_total_relation_size('ltc') as pcr
from ltc l