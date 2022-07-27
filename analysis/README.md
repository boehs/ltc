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

> **Note**: There are negative comments and I am as confused as you are. It's not my fault. Somehow my data source has negative comments sometimes

### [Upvotes](buckets/upvote/data.csv)

- `count` of letters and average number of comments per bucket
- In buckets of how many upvotes each letter recieved (rounded to the nearest 10th)

### [Letters Per Month](buckets/lettersPerMonth/data.csv)

- `count` of letters, `count` of upvotes, `count` of comments
- in buckets of letter post month

> **Note**: It should be obvious that the commenting feature was introduced at a later date

## Count

By contrast, there is no grouping here. I just want to see the count of a certain thing

### [Gender](counts/gender/data.csv)

- Whenever `he`,`him`, or `his` is used the author is assumed to be female
- Whenever `she` or `her` is used the author is assumed to be male

> **Warning**: This makes a number of gross assumptions.

- Assumes heterosexuality, you should
  - Subtract 3% from male
  - Add that 3% to female
  - And vice versa
- Assumes the pronouns are *always* referring to OP's crush, not someone else
- Disregards gender neutral pronouns
  - Because it's not uncommon to refer to someone of *any* pronoun using they/them
    - *ie:* "They changed my life", "Their hair is beautiful"

Still, it's interesting to see that roughly 2x more posts are probably made by females than posts by males, even with any generous margin of error.

### [Totals](counts/totals/data.csv)

Ok so I lied, in total there is 800k letters, not 1 million 😊

### [Top Words](counts/topWords/data.csv)

The top 1000 words

> **Note**: You may notice lots of stems instead of words.
> For instance "someon" instead of "someone".
> This is because the postgres ts_vector in use is using the "english" dictionary. This allows one entry for things like 'walk', 'walks' and also 'walking', but results in words sometimes being caught short.
> See:
>
> - https://en.wikipedia.org/wiki/Lexeme
> - https://en.wikipedia.org/wiki/Stemming
