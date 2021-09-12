import { Box, Typography } from '@material-ui/core'
import { blue } from '@material-ui/core/colors'
import React, { FunctionComponent } from 'react'

type Props = { replyPostCount: number }

export const DivPostCounts: FunctionComponent<Props> = ({
  replyPostCount = 0,
}) => {
  if (replyPostCount < 1) {
    return null
  }

  return (
    <Box
      sx={{
        width: 24,
        height: 15,
        backgroundColor: blue[100],
        borderRadius: (theme) => theme.shape.borderRadius,
      }}
    >
      <Typography
        sx={{
          color: (theme) => theme.palette.primary.dark,
          fontSize: `${10}px`,
          fontWeight: 'bold',
        }}
        align={'center'}
      >
        {replyPostCount}
      </Typography>
    </Box>
  )
}
