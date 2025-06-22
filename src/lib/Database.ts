type transactionModes = "readonly" | "readwrite"

export default class Database{
    #name: string;
    #version: number
    #upgrader: (db: IDBDatabase) => void

    #connection: Promise<IDBDatabase | null>

    constructor(name: string, version: number, upgrader: (db: IDBDatabase) => void){
        this.#name = name
        this.#version = version
        this.#upgrader = upgrader

        this.#connection = this.openConnection()
    }

    toRequestPromise<T>(action: IDBRequest): Promise<T | null>{
        return new Promise<T | null>((resolve) => {
            action.onerror = () => {resolve(null)}
            action.onsuccess = ({target}) => {
                //@ts-ignore
                resolve(target.result)
            }
        })
    }

    async openDataStores(storeNames: string | string[], mode: transactionModes = "readonly", durability: "default" | "strict" | "relaxed" = "default"): Promise<[Record<string, IDBObjectStore>, IDBTransaction] | undefined>{
        if(await this.#connection == null){
            console.error("Unable to access database connection")
            return undefined
        }
        
        if(typeof(storeNames) == "string")
            storeNames = [storeNames]

        const transaction = (await database).transaction(storeNames, mode, {durability})

        const output: Record<string, IDBObjectStore> = {}
        for(let i=0; i<storeNames.length; i++){
            const name = storeNames[i]
            output[name] = transaction.objectStore(name)
            
        }
        
        return [output, transaction]
    }


    async generateID(store: IDBObjectStore): Promise<string>{
        let id: string
        while(true){
            id = crypto.randomUUID()
            if(await this.toRequestPromise<any>(store.get(id)) == null)
                return id
        }
    }
    

    private openConnection(){
        return new Promise<IDBDatabase | null>(resolve => {
            const request = indexedDB.open(this.#name, this.#version);

            request.onupgradeneeded = (event) => {
                //@ts-ignore
                const upgradeDB: IDBDatabase = event.target.result;
                this.#upgrader(upgradeDB)
            }

            request.onerror = (event) => {
                resolve(null)
                console.error("Unable to load database", event)
            };
            request.onsuccess = (event) => {
                //@ts-ignore
                resolve(event.target.result)
            }
        })
    }
}


export const database = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("Games", 1);

    request.onupgradeneeded = (event) => {
        //@ts-ignore
        const upgradeDB: IDBDatabase = event.target.result;

        if(!upgradeDB.objectStoreNames.contains("active"))
            upgradeDB.createObjectStore("active", { keyPath: "id" });

        if(!upgradeDB.objectStoreNames.contains("archive"))
            upgradeDB.createObjectStore("archive", { keyPath: "id" });
    }

    request.onerror = (event) => {
        reject(event)
        throw Error("Unable to load database")
    };
    request.onsuccess = (event) => {
        //@ts-ignore
        resolve(event.target.result)
    }
})