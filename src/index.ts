import { SqlClient, connect } from "./lib";
import type { Equal, Expect } from "./helpers";

// Type-level DB schema definition

type User = {
    id: string;
    name: string;
    age: number;
    isHuman: boolean;
};

type Schema = {
    users: User;
};

// --- Either use a client class to connect, register the schema, and run SQL queries. ---

{
    const client = new SqlClient<Schema>();

    const res1 = await client.sql("SELECT * FROM users;");
    const res2 = await client.sql("SELECT id, name, age FROM users;");
    const res3 = await client.sql("SELECT * FROM users WHERE age > 18;");
    // @ts-expect-error Invalid SQL statement
    const res4 = await client.sql("SELECT * FROM users");
    // @ts-expect-error Referenced an invalid relation
    const res5 = await client.sql("SELECT * FROM notExisting;");
    // @ts-expect-error Referenced an invalid attribute
    const res6 = await client.sql("SELECT id, notExisting FROM users;");

    // Type-Level Unit Tests for `client`

    type ItShouldSupportSelectAllFromUsers = Expect<Equal<typeof res1, User[]>>;
    type ItShouldSupportSelectSomePropsFromUsers = Expect<
        Equal<typeof res2, { id: string; name: string; age: number }[]>
    >;
    type ItShouldSupportSelectAllFromUsersWithWhereClause = Expect<Equal<typeof res3, User[]>>;
    type ItShouldNotSupportSelectWithoutSemicolon = Expect<Equal<typeof res4, never>>;
    type ItShouldNotSupportSelectOfInvalidRelation = Expect<Equal<typeof res5, never>>;
    type ItShouldNotSupportSelectOfInvalidAttributes = Expect<Equal<typeof res6, never>>;
}

// --- ... or use a `connect()` function ---

{
    const { sql } = await connect<Schema>();

    const res1 = await sql("SELECT * FROM users;");
    const res2 = await sql("SELECT id, name, age FROM users;");
    const res3 = await sql("SELECT * FROM users WHERE age > 18;");
    // @ts-expect-error Invalid SQL statement
    const res4 = await sql("SELECT * FROM users");
    // @ts-expect-error Referenced an invalid relation
    const res5 = await sql("SELECT * FROM notExisting;");
    // @ts-expect-error Referenced an invalid attribute
    const res6 = await sql("SELECT id, notExisting FROM users;");

    // Type-Level Unit Tests for `connect` (same as above)

    type ItShouldSupportSelectAllFromUsers = Expect<Equal<typeof res1, User[]>>;
    type ItShouldSupportSelectSomePropsFromUsers = Expect<
        Equal<typeof res2, { id: string; name: string; age: number }[]>
    >;
    type ItShouldSupportSelectAllFromUsersWithWhereClause = Expect<Equal<typeof res3, User[]>>;
    type ItShouldNotSupportSelectWithoutSemicolon = Expect<Equal<typeof res4, never>>;
    type ItShouldNotSupportSelectOfInvalidRelation = Expect<Equal<typeof res5, never>>;
    type ItShouldNotSupportSelectOfInvalidAttributes = Expect<Equal<typeof res6, never>>;
}
