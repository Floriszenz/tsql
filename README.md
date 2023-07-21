# tsql

This is NOT an actual library. This is just me playing around with the TypeScript type system. This is greatly inspired by the terrific work of [Gabriel Vergnaud](https://github.com/gvergnaud) and his [Type-level Typescript](https://type-level-typescript.com/) course.

This project addresses the question "what might it look like if we want to write raw SQL statements rather than using an ORM, but still get the proper types when we call a function `sql()` with a plain string of SQL". Maybe like this:

```ts
// Type-level schema definition
type User = {
    id: string;
    name: string;
    age: number;
    isHuman: boolean;
};

type Schema = {
    users: User;
};

// Create a client with the schema
const client = new SqlClient<Schema>();

const res1 = await client.sql("SELECT * FROM users;");
//    ^? const res1: User[]

const res2 = await client.sql("SELECT id, name, age FROM users;");
//    ^? const res2: { id: string; name: string, age: number; }[]

// @ts-expect-error "Referenced an invalid relation"
const res3 = await client.sql("SELECT * FROM notExisting;");
//    ^? const res3: never
```

And this IS possible by leveraging the TypeScript type system.

Things that could be added:

-   [ ] Support aliases (`AS`)
-   [ ] Support aggregate functions (e.g., count, avg)
-   [ ] Support multiple relations / JOINs
-   [ ] Support case-insensitive syntax (support `select * from` as well as `SELECT * FROM`)
-   [ ] Support `INSERT` queries
-   [ ] Support `UPDATE` queries
-   [ ] Support `DELETE` queries
