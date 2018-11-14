import createStyles from '@material-ui/core/es/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import React from 'react'
import { pct } from '../libs/styles/pct'
import { px } from '../libs/styles/px'
import { ResponsiveLine } from '@nivo/line'

const Component = ({ classes, data }) => {
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

const styles = ({ spacing }) =>
  createStyles({
    root: {
      width: pct(100),
      height: px(spacing.unit * 20),
      border: '1px solid lightgray',
      borderRadius: 4
    }
  })

export const ChartLine = withStyles(styles)(Component)
