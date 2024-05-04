import React from 'react'

const PercentageBar = ( props ) => {
  //KuarxisStyles.kuarxisProgress.width=`${percent}%`
  const {percent, color} = props
  let percentString = `${percent}%`
     return (
    <div className="kuarxisProgressBar">
       <div className="kuarxisProgressBackgroundBar"></div>
       <div className="kuarxisProgress" style={{width: percentString, backgroundColor: color}}></div>
       <div className="kuarxisProgressText">{percentString}</div>
    </div>
  )
}

PercentageBar.defaultProps = {
  percent: 0,
  color: "#06a00b"
}

export default PercentageBar
