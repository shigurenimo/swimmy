import { Divider, List, ListItem } from "@mui/material"
import { BoxAside } from "app/core/components/box/BoxAside"
import { BoxCardPostSkeleton } from "app/core/components/box/BoxCardPostSkeleton"
import { BoxCardResponseSekeleton } from "app/core/components/box/BoxCardResponseSekeleton"
import { FC, Fragment } from "react"

export const BoxAsideFeedThreadFallback: FC = () => {
  const skeletons = [0, 1, 2, 3]

  return (
    <BoxAside title={"スレッド"}>
      <List disablePadding>
        <ListItem sx={{ pt: 2, pb: 1 }}>
          <BoxCardPostSkeleton />
        </ListItem>
        {skeletons.map((skeleton, index) => (
          <Fragment key={skeleton}>
            <ListItem sx={index === 0 ? { pb: 2, pt: 1 } : { py: 2 }}>
              <BoxCardResponseSekeleton index={index + 1} />
            </ListItem>
            {index !== skeletons.length - 1 && <Divider />}
          </Fragment>
        ))}
      </List>
    </BoxAside>
  )
}
