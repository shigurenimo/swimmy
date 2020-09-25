import { TextField, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { analytics } from 'firebase/app'
import React, { Dispatch, FunctionComponent, SetStateAction } from 'react'

type Props = {
  monthState: [number, Dispatch<SetStateAction<number>>]
  yearState: [number, Dispatch<SetStateAction<number>>]
  earlyState: [boolean, Dispatch<SetStateAction<boolean>>]
}

const FormDate: FunctionComponent<Props> = ({
  monthState: [month, setMonth],
  yearState: [year, setYear],
  earlyState: [early, setEarly],
}) => {
  const classes = useStyles()

  return (
    <form className={classes.root}>
      <TextField
        select
        value={year}
        onChange={event => {
          analytics().logEvent('select_content', {
            content_id: event.target.value,
            content_type: 'form_date_year',
          })
          setYear(parseInt(event.target.value))
        }}
        SelectProps={{ native: true }}
        variant={'outlined'}
        size={'small'}
      >
        {[2017, 2018, 2019, 2020].map(_year => (
          <option key={_year} value={_year}>
            {_year}
          </option>
        ))}
      </TextField>
      <TextField
        select
        value={month}
        onChange={event => {
          analytics().logEvent('select_content', {
            content_id: event.target.value,
            content_type: 'form_date_month',
          })
          setMonth(parseInt(event.target.value))
        }}
        SelectProps={{ native: true }}
        variant={'outlined'}
        size={'small'}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(_month => (
          <option key={_month} value={_month}>
            {_month}
          </option>
        ))}
      </TextField>
      <TextField
        select
        value={early}
        onChange={event => {
          setEarly(event.target.value === 'true')
        }}
        SelectProps={{ native: true }}
        variant={'outlined'}
        size={'small'}
      >
        <option value={'true'}>{'上旬'}</option>
        <option value={'false'}>{'下旬'}</option>
      </TextField>
    </form>
  )
}

const useStyles = makeStyles<Theme>(({ typography, palette, spacing }) => {
  return {
    root: {
      display: 'grid',
      gridAutoColumns: 'max-content',
      gridAutoFlow: 'column',
      gridGap: spacing(1),
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
    },
  }
})

export default FormDate
