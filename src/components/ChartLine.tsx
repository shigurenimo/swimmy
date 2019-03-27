import { makeStyles } from '@material-ui/styles'
import { ResponsiveLine } from '@nivo/line'
import React, { FunctionComponent } from 'react'
import { pct } from '../libs/pct'
import { px } from '../libs/px'

type Props = {
  data: any
}

const ChartLine: FunctionComponent<Props> = ({ data }) => {
  const classes = useStyles({})

  return (
    <div className={classes.root}>
      <ResponsiveLine
        data={data}
        enableDots={false}
        enableGridX={false}
        enableGridY={false}
        lineWidth={1}
        enableArea={true}
        isInteractive={false}
        animate={false}
      />
    </div>
  )
}

const useStyles = makeStyles(({ spacing }) => {
  return {
    root: {
      border: '1px solid lightgray',
      borderRadius: 4,
      height: px(spacing(20)),
      width: pct(100)
    }
  }
})

export default ChartLine
