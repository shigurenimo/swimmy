import { Divider, List, ListItem, ListItemText } from "@mui/material"
import { FC, Fragment } from "react"
import { BoxAside } from "interface/components/box/BoxAside"
import { useChangelogs } from "interface/hooks/useChangelogs"

export const BoxAsideHelloWorld: FC = () => {
  const changelogs = useChangelogs()

  return (
    <BoxAside title={"アップデート"}>
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
