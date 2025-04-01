CREATE OR REPLACE FUNCTION insert_address_log()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS $$
BEGIN
    INSERT INTO "Visit" ("addressId", name, contact, status, attendance, interested, "childrenK5InHome", notes, "prayerRequest", "createdBy")
    VALUES (new.id, new.name, new.contact, new.status, new.attendance, new.interested, new."childrenK5InHome", new.notes, new."prayerRequest", new."updatedBy");

    return new;
END
$$;

CREATE OR REPLACE TRIGGER insert_log_when_address_is_updated_or_created
    AFTER INSERT OR UPDATE OF name, contact, status, attendance, "childrenK5InHome", interested, notes, "prayerRequest"
    ON "Address"
    FOR EACH ROW
EXECUTE PROCEDURE insert_address_log();
