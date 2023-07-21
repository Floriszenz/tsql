export class SqlClient<Schema extends Record<PropertyKey, any>> {
    sql<Query extends string>(
        query: CheckQuery<Schema, Query>,
    ): Promise<AttributesFromQuery<Schema, Query>> {
        throw "unimplemented";
    }
}

export async function connect<Schema extends Record<PropertyKey, any>>() {
    return {
        sql: <Query extends string>(
            query: CheckQuery<Schema, Query>,
        ): Promise<AttributesFromQuery<Schema, Query>> => {
            throw "unimplemented";
        },
    };
}

type AttributesFromQuery<Schema extends Record<PropertyKey, any>, Query> = SelectStatement<
    Schema,
    Query
>;

type SelectStatement<
    Schema extends Record<PropertyKey, any>,
    Query,
> = Query extends `SELECT ${infer Props} FROM ${infer Relation} WHERE ${string};`
    ? CleanupResult<Schema, Props, Relation>
    : Query extends `SELECT ${infer Props} FROM ${infer Relation};`
    ? CleanupResult<Schema, Props, Relation>
    : never;

type CleanupResult<
    Schema extends Record<PropertyKey, any>,
    Props extends string,
    Relation extends string,
> = ArrayOfObjectsWithUnknownPropToNever<
    UnknownArrayToNever<ResolveProps<Schema, Props, Relation>>
>;

type ResolveProps<
    Schema extends Record<PropertyKey, any>,
    Props extends string,
    Relation extends string,
> = Props extends "*"
    ? Pick<Schema, Relation>[Relation][]
    : Compute<Pick<Pick<Schema, Relation>[Relation], Split<Props, ", ">[number]>>[];

type Split<Str, Sep extends string> = Str extends `${infer First}${Sep}${infer Rest}`
    ? [First, ...Split<Rest, Sep>]
    : [Str];

type UnknownArrayToNever<T extends any[]> = T[number] extends {} ? T : never;

type ArrayOfObjectsWithUnknownPropToNever<T extends any[]> = T[number][keyof T[number]] extends {}
    ? T
    : never;

type Compute<Obj> = { [k in keyof Obj]: Obj[k] } & unknown;

type CheckQuery<Schema extends Record<PropertyKey, any>, Query> = AttributesFromQuery<
    Schema,
    Query
> extends never
    ? "Invalid SQL statement"
    : AttributesFromQuery<Schema, Query>[number] extends {}
    ? AttributesFromQuery<Schema, Query>[number][keyof AttributesFromQuery<
          Schema,
          Query
      >[number]] extends {}
        ? Query
        : "Referenced an invalid attribute"
    : "Referenced an invalid relation";
