import { Divider, List, ListItem, ListItemText } from "@mui/material"
import { BoxAside } from "app/core/components/box/BoxAside"
import { useChangelogs } from "app/core/hooks/useChangelogs"
import React, { Fragment, FunctionComponent } from "react"

export const BoxAsideHelloWorld: FunctionComponent = () => {
  const changelogs = useChangelogs()

  return (
    <BoxAside title={"アップデート履歴"}>
      <List disablePadding>
        {changelogs.map((changelog, index) => (
          <Fragment key={changelog.version}>
            <ListItem>
              <ListItemText
                primary={changelog.version}
                secondary={changelog.texts.join("\n")}
                sx={{ whiteSpace: "pre-wrap" }}
              />
            </ListItem>
            {index < changelogs.length - 1 && <Divider />}
          </Fragment>
        ))}
      </List>
    </BoxAside>
  )
}
