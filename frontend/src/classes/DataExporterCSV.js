import { cleanCsvValue } from '../libs/csvProcessingLib'
import DataExporter from './DataExporter'
export const  DATA_EXPORTER_TYPE_CSV= "DATA_EXPORTER_TYPE_CSV"

export class DataExporterCSV extends DataExporter {
    constructor(exportFieldNames){
       super(DATA_EXPORTER_TYPE_CSV, exportFieldNames)
    }
    
    addMultipleData (data){
        
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
                  utf8SurveyShortName = cleanCsvValue(
                     outputField.surveyShortName,
                  )
                  utf8String =
                     utf8SurveyShortName + '_' + utf8String
               }

               this.dataExported = this.dataExported + utf8String + ','
            }
            //this.dataExported = rowCleaner2(this.dataExported.slice(0, -1)) + '\n'
            this.dataExported = this.dataExported.slice(0, -1) + '\n'
            this.addHeaders = false

            //outputValue = outputValues[0]
         }
         for (const outputValue of outputValues) {
            let rowValues = ''
            for (const outputField of outputsLayouts) {
               let stringValue = outputValue[outputField.fieldName]
               let utf8String = cleanCsvValue(stringValue)
               rowValues = rowValues + utf8String + ','
            }
            //rowValues = rowCleaner2(rowValues.slice(0, -1)) + '\n'
            rowValues = rowValues.slice(0, -1) + '\n'
            this.dataExported = this.dataExported + rowValues
         }

        return this.dataExported  
    }
}



