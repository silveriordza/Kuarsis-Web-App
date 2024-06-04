
class DataExporter {
    constructor(exportType, exportFieldNames=true){
        this.dataExported = ''
        this.addHeaders = true
        this.exportType = exportType
        this.exportFieldNames = exportFieldNames
    }
    
   
 
    addMultipleData (data){
        return this.dataExported
    }

    getData (){
        return this.dataExported   
    }
}

export default DataExporter;


