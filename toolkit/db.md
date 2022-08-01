## Extensions Used


```
CREATE EXTENSION tsm_system_rows ;
```

## Tables

### ltc

```sql
CREATE TABLE public.ltc (
    lettermessage text,
    lettertags character(36),
    id integer NOT NULL,
    letterpostdate timestamp without time zone,
    letterup smallint,
    letterlevel smallint,
    letterlanguage character(5),
    senderip character varying(30),
    sendercountry character varying(15),
    senderregion text,
    sendercity text,
    lettercomments smallint,
    tofacebookuid integer,
    fromfacebookuid integer,
    hidden boolean DEFAULT false,
    lmts tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, lettermessage)) STORED
);

ALTER TABLE ONLY public.ltc
    ADD CONSTRAINT ltc_pk PRIMARY KEY (id);

CREATE INDEX lmts_idx ON public.ltc USING gin (lmts);
```

### ltccomments

```sql
CREATE TABLE public.ltccomments (
    id bigint NOT NULL,
    letterid integer,
    commentmessage text,
    commentername text,
    sendemail boolean,
    hearts smallint,
    commenteremail text,
    commenterguid text,
    level smallint,
    commenterip text,
    commentdate timestamp without time zone,
    viadisqus boolean,
    extradisqusmetadata jsonb
);

ALTER TABLE ONLY public.ltccomments
    ADD CONSTRAINT ltccomments_pk PRIMARY KEY (id);
    
CREATE INDEX ltccomments_letterid_idx ON public.ltccomments USING btree (letterid);

ALTER TABLE ONLY public.ltccomments
    ADD CONSTRAINT fk_letter FOREIGN KEY (letterid) REFERENCES public.ltc(id);
```