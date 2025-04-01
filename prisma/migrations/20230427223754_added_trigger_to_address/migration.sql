-- This is an empty migration.

CREATE OR REPLACE FUNCTION insert_address_log()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS $$
BEGIN
    INSERT INTO "Visit" ("addressId", name, contact, status, attendance, interested, notes, "prayerRequest", "createdBy")
    VALUES (new.id, new.name, new.contact, new.status, new.attendance, new.interested, new.notes, new."prayerRequest", new."updatedBy");

    return new;
END
$$;

CREATE TRIGGER insert_log_when_address_is_updated_or_created
    AFTER INSERT OR UPDATE OF name, contact, status, attendance, interested, notes, "prayerRequest"
    ON "Address"
    FOR EACH ROW
EXECUTE PROCEDURE insert_address_log()
