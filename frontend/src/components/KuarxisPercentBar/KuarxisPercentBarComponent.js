import React from 'react'

const KuarxisPercentBarComponent = ( props ) => {
  //KuarxisStyles.kuarxisProgress.width=`${percent}%`
  const {percent, color, barWidth} = props
  let percentString = `${percent}%`
  const styleDynamic = {width: percentString, backgroundColor: color}
  const styleBarDynamic = barWidth == -1? {}:{width: barWidth}
     return (
     <div className="kuarxisProgressBackgroundBar" style={styleBarDynamic}>
       <div className="kuarxisProgressBar" style={styleDynamic}></div>
       <div className="kuarxisProgressBarText">{percentString}</div>
    </div>
  )
}

KuarxisPercentBarComponent.defaultProps = {
  percent: 0,
  color: "#06a00b",
  barWidth: -1
}

export default KuarxisPercentBarComponent 