import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import { firestore } from 'firebase/app'
import React from 'react'
import { collectionData } from 'rxfire/firestore'
import { CHANGELOGS } from '../constants/collection'
import { DESC } from '../constants/order'
import { CardChangelog } from '../containers/CardChangelog'
import { createdAt } from '../libs/createdAt'
import { px } from '../libs/styles/px'
import { toVersionStr } from '../libs/toVersionStr'

class Component extends React.Component<any, any> {
  state = { changelogs: [] }
  isUnmounted = false
  subscription

  render() {
    const { classes } = this.props
    const { changelogs } = this.state

    return (
      <div className={classes.root}>
        <ul className={classes.changelogs}>
          {changelogs.map(changelog => (
            <li className={classes.changelog} key={changelog.id}>
              <CardChangelog
                version={changelog.ui.version}
                date={changelog.ui.date}
                contents={changelog.contents}
              />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  componentDidMount() {
    const query = firestore()
      .collection(CHANGELOGS)
      .limit(40)
      .orderBy('version', DESC)
    this.subscription = collectionData(query).subscribe(docs => {
      if (this.isUnmounted) {
        return
      }
      this.setState({
        changelogs: [
          ...docs.map(doc => ({
            ...doc,
            ui: {
              version: toVersionStr(doc.version),
              date: createdAt(doc.date, false)
            }
          }))
        ]
      })
    })
  }

  componentWillUnmount() {
    this.isUnmounted = true
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}

const styles = ({ spacing }) =>
  createStyles({
    root: { width: '100%' },
    changelogs: {
      display: 'grid',
      gridRowGap: px(spacing.unit * 2),
      listStyle: 'none',
      paddingTop: spacing.unit * 2,
      paddingLeft: spacing.unit * 2,
      paddingRight: spacing.unit * 2,
      margin: 0
    },
    changelog: {}
  })

export const PageChangelogs = withStyles(styles)(Component)
