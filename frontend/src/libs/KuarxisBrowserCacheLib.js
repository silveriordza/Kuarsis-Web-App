/**@format */

import Dexie from 'dexie'

import { KUARXIS_BROWSER_CACHE_DEXIE_DB_NAME } from '../constants/enviromentConstants'

export const kuarxisBrowserCacheDB = new Dexie(
   KUARXIS_BROWSER_CACHE_DEXIE_DB_NAME,
)

kuarxisBrowserCacheDB.open().catch(error => {
   console.error('Failed to open the database:', error)
})

let x
x = x + 1

export const createTable = tableDefinition => {
   if (
      !kuarxisBrowserCacheDB.tables.find(table =>
         Object.keys(tableDefinition).includes(table.name),
      )
   ) {
      kuarxisBrowserCacheDB.version(1).stores(tableDefinition)
      let x
      x = x + 1
   }
}

export const putRecord = async (tableInUse, recordObject) => {
   try {
      // Add the new friend!
      const tableFound = kuarxisBrowserCacheDB.tables.find(
         table => table.name === tableInUse,
      )
      const id = await tableFound.put(recordObject)

      return id
   } catch (error) {
      throw Error(
         `Error while KuarxisBrowserCache adding record ${recordObject} to table ${tableInUse}. Error ${error.message}`,
      )
   }
}
export const getRecord = async tableInUse => {
   try {
      const tableFound = kuarxisBrowserCacheDB.tables.find(
         table => table.name === tableInUse,
      )
      const record = await tableFound.toArray()
      return record
   } catch (error) {
      throw error
   }
}
export const clearTable = async tableInUse => {
   try {
      const tableFound = kuarxisBrowserCacheDB.tables.find(
         table => table.name === tableInUse,
      )
      await tableFound.clear()
   } catch (error) {
      throw error
   }
}
