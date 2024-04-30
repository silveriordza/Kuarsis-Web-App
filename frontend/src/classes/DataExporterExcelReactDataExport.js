/** @format */

import { cleanCsvValue } from '../libs/csvProcessingLib'
import DataExporter from './DataExporter'
export const DATA_EXPORTER_TYPE_EXCEL_REACT_DATA_EXPORT =
   'DATA_EXPORTER_TYPE_EXCEL_REACT_DATA_EXPORT'

export class DataExporterExcelReactDataExport extends DataExporter {
   constructor(exportFieldNames) {
      super(DATA_EXPORTER_TYPE_EXCEL_REACT_DATA_EXPORT, exportFieldNames)
      this.dataExported = [{ columns: [], data: [] }]
      this.width = { wch: 20 }
   }

   addColumn(title) {
      const dataExported = this.dataExported[0]
      const columns = dataExported.columns
      columns.push({ title: title, width: this.width })
   }

   addFieldValueToRow(row, value) {
      if (!row) {
         row = []
      }
      row.push({ value: value })
      return row
   }

   addRow(row) {
      const dataExported = this.dataExported[0]
      const data = dataExported.data
      data.push(row)
      return data
   }

   addMultipleData(data) {
      let outputsInfo = data.outputsInfo
      let outputsLayouts = outputsInfo.outputLayouts
      let outputValues = outputsInfo.outputValues

      if (this.addHeaders) {
         let utf8String = ''
         let utf8SurveyShortName = ''

         for (const outputField of outputsLayouts) {
            if (this.exportFieldNames) {
               utf8String = cleanCsvValue(outputField.fieldName)
            } else {
               utf8String = cleanCsvValue(outputField.question)
               utf8SurveyShortName = cleanCsvValue(outputField.surveyShortName)
               utf8String = utf8SurveyShortName + '_' + utf8String
            }

            //this.dataExported = this.dataExported + utf8String + ','
            this.addColumn(utf8String)
         }
         //this.dataExported = rowCleaner2(this.dataExported.slice(0, -1)) + '\n'
         //this.dataExported = this.dataExported.slice(0, -1) + '\n'
         this.addHeaders = false

         //outputValue = outputValues[0]
      }
      for (const outputValue of outputValues) {
         let rowValues = []
         for (const outputField of outputsLayouts) {
            //let stringValue = outputValue[outputField.fieldName]
            //let utf8String = cleanCsvValue(stringValue)
            //rowValues = this.addFieldValueToRow(rowValues, utf8String)
            let value = null
            switch (outputField.dataType) {
               case 'Date':
                  value = outputValue[outputField.fieldName] ?? ''
                  break
               case 'String':
                  value = cleanCsvValue(
                     outputValue[outputField.fieldName] ?? '',
                  )
                  break
               case 'Integer':
                  let cleanValue = cleanCsvValue(
                     outputValue[outputField.fieldName],
                  )
                  if (cleanValue == '' || isNaN(cleanValue)) {
                     value = 0
                  } else {
                     value = parseInt(cleanValue)
                  }
                  break
               default:
                  throw Error(
                     `Invalid data type in DataExporterExcelReactDataExport field=${outputField.fieldName} data type=${outputField.dataType}`,
                  )
            }
            rowValues = this.addFieldValueToRow(rowValues, value)
         }
         //rowValues = rowValues.slice(0, -1) + '\n'
         this.addRow(rowValues)
         //this.dataExported = this.dataExported + rowValues
      }

      return this.dataExported
   }
}
