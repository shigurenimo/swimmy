import { List, ListItem } from "@mui/material"
import { BoxCardPostSkeleton } from "app/core/components/box/BoxCardPostSkeleton"
import { BoxMain } from "app/core/components/box/BoxMain"
import { BoxFormPost } from "app/threads/components/BoxFormPost"
import { FC } from "react"

export const BoxFeedFallback: FC = () => {
  const skeletons = [0, 1, 2, 3, 4, 5]

  return (
    <BoxMain>
      <BoxFormPost isLoading={true} />
      <List>
        {skeletons.map((skeleton) => (
          <ListItem key={skeleton}>
            <BoxCardPostSkeleton />
          </ListItem>
        ))}
      </List>
    </BoxMain>
  )
}
