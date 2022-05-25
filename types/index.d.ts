export function weeDb(load: any, save: any): Promise<{
    insert: (key: any, value: any) => Promise<any>;
    update: (key: any, value: any) => Promise<void>;
    get: (key: any, id: any) => any;
    query: (key: any, predicate: any) => any;
}>;
export namespace weeDb {
    function getId(): any;
}
//# sourceMappingURL=index.d.ts.map