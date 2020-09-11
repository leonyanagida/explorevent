import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

const customToolTipStyes = makeStyles(() => ({
  tooltip: {
    backgroundColor: 'gray',
    color: 'white',
    fontSize: '0.8em',
    marginTop: '0.5em',
    paddingLeft: '0.7em',
    paddingRight: '0.7em',
    paddingBottom: '0.3em',
    paddingTop: '0.3em',
    position: 'absolute',
    zIndex: 1,
  },
}))

const CustomTooltip = (props: { arrow?: boolean; children: any; title: string }) => {
  const classes = customToolTipStyes()
  const [isShown, setIsShown] = useState<boolean>(false)

  return (
    <>
      <div onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}>
        {props.children}
      </div>
      {isShown && <div className={classes.tooltip}>{props.title}</div>}
    </>
  )
}

export default CustomTooltip
