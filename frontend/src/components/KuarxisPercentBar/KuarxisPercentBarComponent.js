import React from 'react'
import { LogThis, LoggerSettings, L1, L2, L3, L0} from '../../libs/Logger'

export const calculateStyleCriteria = (valueIn, styleCriterias)=>{
  const srcFileName = 'KuarxisPercentBarComponent'
  const log = new LoggerSettings(srcFileName, 'calculateStyleCriteria')
  let value = valueIn
  if (isNaN(value)) {
    LogThis(
       log,
       `Error: value is not numeric for value=${value}`,
       L3,
    )
    throw Error(
       `At function KuarxisPercentBarComponentTemplate, the value=${value} is not numeric`,
    )
 }

 let styleCriteriaFound = false
 let style = null
 value = (value * 100).toFixed(0)
 for (const styleCriteria of styleCriterias) {
    if (value >= styleCriteria.min && value <= styleCriteria.max) {
       style = styleCriteria.style
       LogThis(
          log,
          `styleCriteria found, field: ${styleCriteria.fieldNameValue} value=${value} styleCriteria=${styleCriteria.style}`,
          L3,
       )
       styleCriteriaFound = true
       break
    }
 }
 if (!styleCriteriaFound) {
    LogThis(
       log,
       `Somethign is wrong, styleCriteria not found for: ${JSON.stringify(styleCriterias)} value=${value}`,
       L3,
    )
    throw Error(
       `Somethign is wrong, styleCriteria not found for: ${JSON.stringify(styleCriterias)}value=${value}`,
    )
 }
    return style
}

const srcFileName = "KuarxisPercentBarComponent"
export const KuarxisPercentBarComponentTemplate = (props, layout) => {
   let value = props[layout.fieldName]
   const log = new LoggerSettings(srcFileName, "KuarxisPercentBarComponentTemplate" )

   if (isNaN(value)) {
      LogThis(
         log,
         `Error: value is not numeric for ${layout.fieldName} value=${value}`,
         L3,
      )
      throw Error(
         `At function KuarxisPercentBarComponentTemplate, the value for field ${layout.fieldName} is not numeric`,
      )
   }

   let styleCriteriaFound = false
   let style = null
   value = (value * 100).toFixed(0)
   for (const styleCriteria of layout.displayType.styleCriterias) {
      if (value >= styleCriteria.min && value <= styleCriteria.max) {
         style = styleCriteria.style
         LogThis(
            log,
            `styleCriteria found, field: ${styleCriteria.fieldNameValue} value=${value} styleCriteria=${styleCriteria.style}`,
            L3,
         )
         styleCriteriaFound = true
         break
      }
   }
   if (!styleCriteriaFound) {
      LogThis(
         log,
         `Somethign is wrong, styleCriteria not found for: ${layout.fieldName} value=${value}`,
         L3,
      )
      throw Error(
         `Somethign is wrong, styleCriteria not found for: ${layout.fieldName} value=${value}`,
      )
   }

   return (
      <KuarxisPercentBarComponent
         percent={value}
         color={style}
         // barWidth={'10%'}
      />
   )
}

const KuarxisPercentBarComponent = ( {id="", percent=0, color="#06a00b", barWidth=-1} ) => {
  //KuarxisStyles.kuarxisProgress.width=`${percent}%`
  const srcFileName = 'KuarxisPercentBarComponent'
  const log = new LoggerSettings(srcFileName, 'KuarxisPercentBarComponent')
  
  //const {percent, color, barWidth} = props 
 LogThis(log, `Entering`, L3)
  

  let percentString = `${percent}%`
  const styleDynamic = {width: percentString, backgroundColor: color}
  const styleBarDynamic = barWidth == -1? {}:{width: barWidth}
  LogThis(log, `Returning`, L3)
     return (
     <div id={id} className="kuarxisProgressBackgroundBar" style={styleBarDynamic}>
       <div className="kuarxisProgressBar" style={styleDynamic}></div>
       <div className="kuarxisProgressBarText">{percentString}</div>
    </div>
  )
}

// KuarxisPercentBarComponent.defaultProps = {
//   percent: 0,
//   color: "#06a00b",
//   barWidth: -1
// }

export default KuarxisPercentBarComponent 