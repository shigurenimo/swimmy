import {
  Card,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  Theme,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { Changelog } from '../types/changelog'

type Props = { changelog: Changelog }

export const CardChangelog: FunctionComponent<Props> = ({ changelog }) => {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      <CardHeader
        titleTypographyProps={{ style: { fontWeight: 'bold' }, variant: 'h6' }}
        title={changelog.version}
      />
      <Divider />
      <List dense>
        {changelog.commits.map((commit, index) => (
          <ListItem key={index}>
            <ListItemText primary={commit.text} />
          </ListItem>
        ))}
      </List>
    </Card>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return { root: { display: 'grid' } }
})
