import React from 'react'

const PercentageBar = ( props ) => {
  //KuarxisStyles.kuarxisProgress.width=`${percent}%`
  const {percent, color} = props
  let percentString = `${percent}%`
  const styleDynamic = {width: percentString, backgroundColor: color}
  if (percent < 30){
    //styleDynamic.height = "60%"
    //styleDynamic.top = "18%"
    //styleDynamic.borderRadius="1000px"
  }

     return (
    // <div className="kuarxisProgressBar">
    //    <div className="kuarxisProgressBackgroundBar"></div>
    //    <div className="kuarxisProgress" style={styleDynamic}></div>
    //    <div className="kuarxisProgressText">{percentString}</div>
    // </div>
     <div className="kuarxisProgressBar">
       {/* <div className="kuarxisProgressBackgroundBar"></div> */}
       <div className="kuarxisProgress" style={styleDynamic}></div>
       <div className="kuarxisProgressText">{percentString}</div>
    </div>
  )
}

PercentageBar.defaultProps = {
  percent: 0,
  color: "#06a00b"
}

export default PercentageBar
