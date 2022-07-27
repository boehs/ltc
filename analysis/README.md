# Analysis

Various `PLpgSQL` files and, often, their response in `CSV` format.

## Utilities

I use these for database management and you should ignore them, basically if it's not documented here and the results aren't posted then it's probably souly for maintence. Still, to satisfy your intellectual curiosity, I've documented many of them.

### `missingIds.pgsql`

This is for use in [#1](https://github.com/boehs/ltc/issues/1). There are two issues

- Hidden letters are often viewable by direct link but **NOT** from the API
- Identifying gaps (possible issue with our script?)

I hope to find some way to get these missing letters from the API instead, because it contains useful information not normally exposed. Still, some data better than no data.

### `estimateSizeOfColumn.pgsql`

Interested to see the amount of space all the letters collectively take on my computer. 

## Buckets

Most queries fit under here. Basically everything using some sort of `group by` clause AKA sorting things into buckets.

### [Comments](buckets/comments/data.csv)

- `count` of letters and average number of upvotes per bucket.
- In buckets of how many comments each letter recieved

> **NOTE:** There are negative comments and I am as confused as you are. It's not my fault. Somehow my data source has negative comments sometimes

### [Upvotes](buckets/upvote/data.csv)

- `count` of letters and average number of comments per bucket
- In buckets of how many upvotes each letter recieved (rounded to the nearest 10th)

### [Letters Per Month](buckets/lettersPerMonth/data.csv)

- `count` of letters, `count` of upvotes, `count` of comments
- in buckets of letter post month

> **NOTE:** It should be obvious that the commenting feature was introduced at a later date