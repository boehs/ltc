select word, ndoc as "total letters", nentry as "total occurrences"
from ts_stat($$select lmts from ltc$$)
where
    length(word) > 2
order by
    nentry desc,
    ndoc desc
limit 1000