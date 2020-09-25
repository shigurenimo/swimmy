import React, { FunctionComponent } from 'react'
import { MicroCMSContext } from './MicroCMSContext'

type Props = {
  apiKey: string
  serviceId: string
}

export const MicroCMSProvider: FunctionComponent<Props> = ({
  apiKey,
  children,
  serviceId,
}) => {
  return (
    <MicroCMSContext.Provider value={{ apiKey, serviceId }}>
      {children}
    </MicroCMSContext.Provider>
  )
}
