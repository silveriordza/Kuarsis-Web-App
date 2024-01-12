/** @format */

const formatDate = inputDate => {
   const date = new Date(inputDate)

   const year = date.getFullYear()
   const month = (date.getMonth() + 1).toString().padStart(2, '0')
   const day = date.getDate().toString().padStart(2, '0')
   const hours = date.getHours().toString().padStart(2, '0')
   const minutes = date.getMinutes().toString().padStart(2, '0')

   return `${year}-${month}-${day} ${hours}:${minutes}`
}

const validateHasData = (log, dataToCheck, errorMessage) => {
   if (
      !(
         dataToCheck &&
         ((Array.isArray(dataToCheck) && dataToCheck.length > 0) ||
            typeof dataToCheck == 'object')
      )
   ) {
      throw new Error(errorMessage)
   }
}

const addDecimals = num => {
   return (Math.round(num * 100) / 100).toFixed(2)
}

const applyStringCriteriaToValue = (criteria, value) => {
   //const functionName = 'applyStringCriteriaToValue'

   //const log = new LoggerSettings('Functions.js', 'applyStringCriteriaToValue')

   const parseCriteria = criteria.split(' ')
   let newValue = parseInt(value)
   if (typeof newValue != 'number' || newValue == null || isNaN(newValue)) {
      newValue = 0
   }
   //LogThis(log, `parseCriteria=${JSON.stringify(parseCriteria)}`, L3)
   switch (parseCriteria[0]) {
      case '>':
         if (newValue > parseCriteria[1]) {
            return parseCriteria[3]
         } else {
            return parseCriteria[5]
         }
      case '==':
         if (newValue == parseCriteria[1]) {
            //   LogThis(
            //       log,
            //       `TRUE Criteria newValue=${newValue}==${parseCriteria[1]}=>${parseCriteria[3]}`,
            //       L3,
            //    )
            return parseCriteria[3]
         } else {
            // LogThis(
            //    log,
            //    `FALSE Criteria newValue=${newValue}==${parseCriteria[1]}=>=>${parseCriteria[5]}`,
            //    L3,
            // )
            return parseCriteria[5]
         }
      default:
         // LogThis(
         //    log,
         //    `Criteria must start with > : criteria=${criteria}; value=${value}`,
         //    L0,
         // )
         throw new Error(
            `Criteria must start with > : criteria=${criteria}; value=${value}`,
         )
   }
}

const addPropertyValueInArray = (objectsList, fieldNameToAdd, value) => {
   objectsList.forEach(object => (object[fieldNameToAdd] = value))
}

const addPropertyMatchingValueInArray = (
   objectsList,
   fieldNameToAdd,
   matchingField,
   externalIdField,
   matchingValueArray,
) => {
   objectsList.forEach(object => {
      object[fieldNameToAdd] = matchingValueArray.find(matchingValue => {
         return (
            object[matchingField].toLowerCase() ===
            matchingValue[matchingField].toLowerCase()
         )
      })[externalIdField]
   })
}

function getValueByPath(obj, path) {
   const keys = path.split('.')
   let currentObj = obj

   for (const key of keys) {
      if (currentObj && typeof currentObj === 'object' && key in currentObj) {
         currentObj = currentObj[key]
      } else {
         // Property not found, return a default value or handle the case as needed
         return undefined
      }
   }

   return currentObj
}

module.exports = {
   formatDate,
   addDecimals,
   applyStringCriteriaToValue,
   validateHasData,
   addPropertyValueInArray,
   addPropertyMatchingValueInArray,
}
