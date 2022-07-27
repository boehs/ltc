select
    (
        select count(*)
        from ltc
        where
            -- he has amazing eyes
            lower(lettermessage) like '%he%'
            -- I love him
            or lower(lettermessage) like '%him%'
            -- his eyes are so pretty
            or lower(lettermessage) like '%his%'
    ) as she,
    (
        select count(*)
        from ltc
        where
            -- she has amazing eyes
            lower(lettermessage) like '%she%'
            -- I love her
            or lower(lettermessage) like '%her%'

    ) as he