import { Box, Paper, Stack } from '@mui/material'
import React, { FunctionComponent } from 'react'

type Props = { fileIds: string[] }

export const DivThreadImages: FunctionComponent<Props> = ({ fileIds }) => {
  return (
    <Stack spacing={2}>
      {fileIds.map((fileId) => (
        <Paper key={fileId}>
          <Box
            component={'img'}
            alt={fileId}
            src={`//swimmy.io/images/${fileId}?fm=png&w=800`}
            sx={{ width: `${100}%`, borderRadius: 4, verticalAlign: 'bottom' }}
          />
        </Paper>
      ))}
    </Stack>
  )
}
