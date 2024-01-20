const { addPropertyValueInArray } = require("../utils/Functions")
const { HasDataMultipeEx } = require("../utils/Logger")
const { LogManager, L0, L3, L1, L2} = require("./LogManager")
const MongoDBManager = require("./MongoDBManager")

class TemplateManager {
    constructor(/*templateList,*/ collection, identifierFieldName){
        this.log = new LogManager("TemplateManager.js", "constructor")
        this.log.LogThis(`START`, L3)
        
        this.mongoDBManager = new MongoDBManager(collection)
        this.oneToManyLinkField = ''
        this.oneToManyLinkValue = ''
        this.templateList = null
        this.templateLean = null
        this.collection = collection
        this.identifierFieldName = identifierFieldName 
        this.identifiersList = null
    }

    async deleteAllMatchingTemplates () {
                
        const log = this.log

        log.setFunctionName("deleteAllMatchingTemplates")

        const identifiersList = this.identifiersList

        log.HasData(identifiersList) || this.getIdentifiersList()

        log.HasDataMultipeEx("collectionToDeleteFrom,filterByField, this.identifiersList", this.collection, this.identifierFieldName, this.identifiersList)

        const result = this.mongoDBManager.deleteManyWithCheck(this.collection, this.identifierFieldName, this.identifiersList)
        return result
    }
     //Updates the namesList in the parent TemplateMangaer based on specific function for the type of template.
     getIdentifiersList  () {
        this.log.HasDataMultipeEx("templateList, identifierFieldName",
        this.templateList, this.identifierFieldName)

        this.identifiersList = this.templateList.map(template => (template[this.identifierFieldName]))
        return this.identifiersList
    }
    setOneToManyConstantLink(oneToManyLinkField, oneToManyLinkValue){
        this.oneToManyLinkField=oneToManyLinkField
        this.oneToManyLinkValue=oneToManyLinkValue
    }
    prepareOneToManyConstantTemplate  () 
        {   this.log.HasDataMultipeEx(`templateList, ${this.oneToManyLinkField}`,
            this.templateList, this.oneToManyLinkValue)
            addPropertyValueInArray(this.templateList, this.oneToManyLinkField, this.oneToManyLinkValue)
        }

    async save () {
        this.log.HasDataMultipeEx("templateList, collection, identifierFieldName",
        this.templateList, this.collection, this.identifierFieldName)

        await this.deleteAllMatchingTemplates()

        this.templateStoredInDB = await this.mongoDBManager.insertMany(this.templateList)
        this.templateLean = await this.templateStoredInDB.map(doc => doc.toObject({virtuals: true, getters: true }))
        return this.templateLean

    }

    async load(filter) {
        this.templateList=await this.mongoDBManager.findSortedAsc(filter)
        
        
        this.templateLean = this.mongoDBManager.leanCollectionList(this.templateList)
        return this.templateLean
    }

    combineSurveyElements (
        elementsToCombineInto,         
        fieldToMachInto,
        newFieldToAddInto,
        elemenetsToCombineFrom,
        fieldToMatchFrom
        ){
            this.log.HasDataMultipeEx("elementsToCombineInto,elemenetsToCombineFrom,fieldToMachInto, newFieldToAddInto, fieldToMatchFrom", elementsToCombineInto,elemenetsToCombineFrom,fieldToMachInto,newFieldToAddInto, fieldToMatchFrom)

            elementsToCombineInto.forEach(elementInto => {
                let newElementInto = elemenetsToCombineFrom.filter(
                    elementFrom => {
                        let result = elementInto[fieldToMachInto].toString()==elementFrom[fieldToMatchFrom].toString()
                        this.log.LogVars(`list`, L3,`survey,into, from, condition`, elementInto.surveyShortName,elementInto[fieldToMachInto], elementFrom[fieldToMatchFrom], elementInto[fieldToMachInto].toString()==elementFrom[fieldToMatchFrom].toString() )
                        return result
                    })
                    
                    newElementInto = newElementInto.slice().sort((a, b) => a.position - b.position)

                    elementInto[newFieldToAddInto]=newElementInto
            })

            this.elementsCombined = elementsToCombineInto
        }
}

module.exports = TemplateManager