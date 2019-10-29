import { Button, ButtonGroup, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'

type Tag = { name: string; count: number }

type Props = { tag: Tag }

const ButtonTag: FunctionComponent<Props> = ({ tag }) => {
  const classes = useStyles({})

  return (
    <ButtonGroup color={'primary'} variant={'outlined'}>
      <Button className={classes.button}>{tag.name}</Button>
      <Button className={classes.count}>{tag.count}</Button>
    </ButtonGroup>
  )
}

const useStyles = makeStyles<Theme>(({ palette, spacing }) => {
  return {
    button: {
      paddingBottom: spacing(0.1),
      paddingTop: spacing(0.1),
    },
    count: {
      minWidth: 0,
      paddingBottom: spacing(0.1),
      paddingLeft: spacing(1),
      paddingRight: spacing(1),
      paddingTop: spacing(0.1),
    },
  }
})

export default ButtonTag
