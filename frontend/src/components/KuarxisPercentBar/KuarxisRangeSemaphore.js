import React from 'react'
import { LogThis, LoggerSettings, L1, L2, L3, L0} from '../../libs/Logger'


export const KuarxisRangesSemaphoreTemplate = (props, layout) => {
   let value = props[layout.fieldName]
   return (
      <KuarxisRangeSemaphore
         value={value}
         styleCriterias={layout.displayType.styleCriterias}
      />
   )
}


const KuarxisRangeSemaphore = ( {id="", value=0, styleCriterias, containerStyle={}} ) => {
  
  const srcFileName = 'KuarxisRangeSemaphore'
  const log = new LoggerSettings(srcFileName, 'KuarxisRangeSemaphore')
  LogThis(log, `Entering`, L3)

  if (isNaN(value)) {
   LogThis(
      log,
      `Error: value is not numeric value=${value}`,
      L3,
   )
   throw Error(
      `At function KuarxisPercentBarComponentTemplate, the value for ${JSON.stringify(styleCriterias)} is not numeric`,
   )
}

if(!styleCriterias){
   LogThis(
      log,
      `Error: styleCriterias value is invalid`,
      L3,
   )
   throw Error(
      `Error: styleCriterias value is invalid`
   )
}
  
  let styleCriteriaFound = false
  let style = null

  for (const styleCriteria of styleCriterias) {
     if (value >= styleCriteria.min && value <= styleCriteria.max) {
        style = styleCriteria.style
        LogThis(
           log,
           `styleCriteria found, ${JSON.stringify(styleCriteria)} value=${value} styleCriteria=${styleCriteria.style}`,
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
        `Somethign is wrong, styleCriteria not found for:  ${JSON.stringify(styleCriterias)} value=${value}`,
     )
  }
  
  const styleDynamic = {backgroundColor: style}
  
  LogThis(log, `Returning the semaphore`)

     return (
      <div id={id} className="kuarxisSemaphoreContainer" style={containerStyle}>
      <span className="kuarxisRangeSemaphore" style={styleDynamic}> </span>
   </div>
  )
}

// KuarxisRangeSemaphore.defaultProps = {
//   percent: 0,
//   color: "#06a00b",
//   barWidth: -1
// }

export default KuarxisRangeSemaphore 