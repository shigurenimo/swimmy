import { Box, Grid, Paper } from '@mui/material'
import React, { FunctionComponent } from 'react'

type Props = { fileIds: string[] }

export const BoxImages: FunctionComponent<Props> = ({ fileIds }) => {
  return (
    <Grid
      spacing={2}
      sx={{
        width: '100%',
        xs: { gridTemplateColumns: 'repeat(2, 1fr)' },
        sm: { gridTemplateColumns: 'repeat(4, 1fr)' },
      }}
    >
      {fileIds.map((fileId) => (
        <Paper key={fileId}>
          <Box
            component={'img'}
            src={`//swimmy.io/images/${fileId}?fm=png&w=400&h=400`}
            alt={fileId}
            sx={{
              width: `${100}%`,
              borderRadius: 4,
              verticalAlign: 'bottom',
            }}
          />
        </Paper>
      ))}
    </Grid>
  )
}
