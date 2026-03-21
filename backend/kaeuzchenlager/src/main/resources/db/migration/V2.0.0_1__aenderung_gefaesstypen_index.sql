use kaeuzchen;

DROP INDEX uk_gefaesstypen_name ON gefaesstypen;

DROP INDEX uk_gefaesstypen_volumen ON gefaesstypen;

ALTER TABLE gefaesstypen
ADD UNIQUE INDEX uk_gefaesstypen (name, volumen);

UPDATE gefaesstypen
SET name = TRIM(REGEXP_REPLACE(name, ' {2,}', ' '))
WHERE name REGEXP ' {2,}' OR name <> TRIM(name);

