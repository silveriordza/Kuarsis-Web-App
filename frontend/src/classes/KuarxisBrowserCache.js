/**@format */

import Dexie from 'dexie'

import { KUARXIS_BROWSER_CACHE_DEXIE_DB_NAME } from '../constants/enviromentConstants'

export const db = new Dexie(KUARXIS_BROWSER_CACHE_DEXIE_DB_NAME)

class KuarxisBrowserCache {
   constructor(tableName) {
      this.kuarxisBrowserCacheDB = db
      this.tableInUse = tableName
   }
   createTable(tableDefinition) {
      if (
         !db.tables.find(table =>
            Object.keys(tableDefinition).includes(table.name),
         )
      ) {
         this.kuarxisBrowserCacheDB.version(1).stores(tableDefinition)
         let x
         x = x + 1
      }
   }

   async putRecord(recordObject) {
      try {
         // Add the new friend!
         const id = await this.kuarxisBrowserCacheDB[this.tableInUse].put(
            recordObject,
         )
         return id
      } catch (error) {
         throw Error(
            `Error while KuarxisBrowserCache adding record ${recordObject} to table ${this.tableInUse}. Error ${error.message}`,
         )
      }
   }
   async getRecord() {
      try {
         const record = await this.kuarxisBrowserCacheDB[
            this.tableInUse
         ].toArray()
         return record
      } catch (error) {
         throw error
      }
   }
   async clearTable() {
      try {
         await this.kuarxisBrowserCacheDB[this.tableInUse].clear()
      } catch (error) {
         throw error
      }
   }
}

export default KuarxisBrowserCache
