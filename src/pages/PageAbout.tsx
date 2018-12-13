import Card from '@material-ui/core/Card/Card'
import CardContent from '@material-ui/core/CardContent/CardContent'
import { Theme } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import { WithStyles } from '@material-ui/styles/withStyles'
import React, { Component } from 'react'
import { px } from '../libs/styles/px'
import { resetList } from '../libs/styles/resetList'

const styles = ({ spacing }: Theme) => {
  return createStyles({
    root: {
      display: 'grid',
      gridRowGap: px(spacing.unit * 4),
      paddingTop: spacing.unit * 4,
      paddingLeft: spacing.unit * 2,
      paddingRight: spacing.unit * 2
    },
    cards: {
      ...resetList(),
      margin: '0 auto',
      maxWidth: spacing.unit * 100,
      display: 'grid',
      gridRowGap: px(spacing.unit * 4)
    }
  })
}

interface Props extends WithStyles<typeof styles> {}

class PageAbout extends Component<Props> {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Typography variant={'h5'}>About</Typography>
        <ul className={classes.cards}>
          <li>
            <Card>
              <CardContent>
                <Typography gutterBottom variant={'h6'} component={'h2'}>
                  Title
                </Typography>
                <Typography component="p">Description</Typography>
              </CardContent>
            </Card>
          </li>
        </ul>
      </div>
    )
  }
}

export default withStyles(styles)(PageAbout)
