export class DataBase {
    private dbName: string;
    private dbVersion: number;
    private db: IDBDatabase | null = null;
    private storeName: string = "datas";

    /**
     * Constructor for the class.
     *
     * @param {string} dbName - The name of the database. Default value is "iptv-manager".
     * @param {number} dbVersion - The version of the database. Default value is 1.1.
     */
    constructor(dbName: string = "iptv-manager", dbVersion: number = 1.1) {
        this.dbName = dbName;
        this.dbVersion = dbVersion;
    }

    /**
     * Opens the database and returns a Promise that resolves to the IDBDatabase object.
     *
     * @return {Promise<IDBDatabase>} A Promise that resolves to the IDBDatabase object.
     */
    openDatabase(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request: IDBOpenDBRequest = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = (event: Event) => {
                reject(new Error((event.target as IDBRequest).error?.message ?? "Error on open database"));
            };

            request.onsuccess = (event: Event) => {
                this.db = (event.target as IDBOpenDBRequest).result as IDBDatabase;
                resolve(this.db);
            };

            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                this.db = (event.target as IDBOpenDBRequest).result as IDBDatabase;
                
                if (!this.db.objectStoreNames.contains(this.storeName))
                    this.db.createObjectStore(this.storeName);
            };
        });
    }

    /**
     * Adds data to the database with the specified key.
     *
     * @param {any} key - The key to associate with the data.
     * @param {any} data - The data to be added to the database.
     * @return {Promise<void>} A promise that resolves when the data is successfully added to the database.
     */
    addData(key: any, data: any): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db)
                throw new Error("db isnt opened.");
            const transaction: IDBTransaction = this.db.transaction(this.storeName, "readwrite");
            const store: IDBObjectStore = transaction.objectStore(this.storeName);

            const addRequest: IDBRequest<IDBValidKey> = store.add(data, key);

            addRequest.onsuccess = (_event: Event) => {
                resolve();
            };

            addRequest.onerror = (event: Event) => {
                reject((event.target as IDBRequest).error?.message ?? "Error on add request");
            };
        });
    }

    /**
     * Sets the data in the database with the specified key.
     *
     * @param {any} key - The key to set the data with.
     * @param {any} data - The data to be set.
     * @return {Promise<boolean>} A promise that resolves with a boolean value indicating whether the data was successfully set.
     */
    setData(key: any, data: any): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (!this.db)
                throw new Error("db isnt opened.");
            const transaction: IDBTransaction = this.db.transaction(this.storeName, "readwrite");
            const store: IDBObjectStore = transaction.objectStore(this.storeName);

            const getRequest: IDBRequest<IDBValidKey> = store.get(key);

            getRequest.onsuccess = (_event: Event) => {
                const existingData = getRequest.result;
                if (!data || /^\s*$/.test(data)) {
                    if (existingData) {
                        const deleteRequest: IDBRequest = store.delete(key);
                        deleteRequest.onsuccess = (_event: Event) => {
                            resolve(true); // Veri silindiği için true döndür
                        };
                        deleteRequest.onerror = (event: Event) => {
                            reject((event.target as IDBRequest).error?.message ?? "Error on delete request");
                        };
                    } else {
                        resolve(false); // Veri zaten yok olduğu için false döndür
                    }
                } else {
                    const putRequest: IDBRequest<IDBValidKey> = store.put(data, key);

                    putRequest.onsuccess = (_event: Event) => {
                        resolve(true); // Veri başarıyla eklendi veya güncellendiği için true döndür
                    };

                    putRequest.onerror = (event: Event) => {
                        reject((event.target as IDBRequest).error?.message ?? "Error on put request");
                    };
                }
            };

            getRequest.onerror = (event: Event) => {
                reject((event.target as IDBRequest).error?.message ?? "Error on get request");
            };
        });
    }

    /**
     * Retrieves data from the database by the specified key.
     *
     * @param {any} key - The key used to retrieve the data.
     * @return {Promise<any>} - A promise that resolves to the retrieved data.
     */
    getDataByKey(key: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.db)
                throw new Error("db isnt opened.");
            const transaction: IDBTransaction = this.db.transaction(this.storeName, "readonly");
            const store: IDBObjectStore = transaction.objectStore(this.storeName);

            const getRequest: IDBRequest<IDBValidKey> = store.get(key);

            getRequest.onsuccess = (event: Event) => {
                const result: any = (event.target as IDBRequest).result;
                resolve(result);
            }; 

            getRequest.onerror = (event: Event) => {
                reject(new Error((event.target as IDBRequest).error?.message ?? "Error on getting data"));
            };
        });
    }

    /**
     * Updates data in the database using a key to identify the data.
     *
     * @param {any} key - The key used to identify the data in the database.
     * @param {any} newData - The new data to be updated in the database.
     * @return {Promise<void>} A promise that resolves when the data has been successfully updated.
     */
    updateDataByKey(key: any, newData: any): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db)
                throw new Error("db isnt opened.");
            const transaction: IDBTransaction = this.db.transaction(this.storeName, "readwrite");
            const store: IDBObjectStore = transaction.objectStore(this.storeName);

            const putRequest: IDBRequest<IDBValidKey> = store.put(newData, key);

            putRequest.onsuccess = (_event: Event) => {
                resolve();
            };

            putRequest.onerror = (event: Event) => {
                reject(new Error((event.target as IDBRequest).error?.message ?? "Error on update"));
            };
        });
    }

    /**
     * Deletes data from the database using the provided key.
     *
     * @param {any} key - The key to identify the data to be deleted.
     * @return {Promise<void>} A promise that resolves when the data is successfully deleted.
     */
    deleteDataByKey(key: any): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db)
                throw new Error("db isnt opened.");
            const transaction: IDBTransaction = this.db.transaction(this.storeName, "readwrite");
            const store: IDBObjectStore = transaction.objectStore(this.storeName);

            const deleteRequest = store.delete(key);

            deleteRequest.onsuccess = (_event: Event) => {
                resolve();
            };

            deleteRequest.onerror = (event: Event) => {
                reject(new Error((event.target as IDBRequest).error?.message ?? "Error on delete"));
            };
        });
    }
}
