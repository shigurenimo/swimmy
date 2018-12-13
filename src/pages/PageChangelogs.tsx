import CircularProgress from '@material-ui/core/CircularProgress'
import Fade from '@material-ui/core/Fade'
import { Theme } from '@material-ui/core/styles'
import { createStyles, withStyles, WithStyles } from '@material-ui/styles'
import { firestore } from 'firebase/app'
import React, { Component } from 'react'
import { collectionData } from 'rxfire/firestore'
import { Subscription } from 'rxjs'
import { take } from 'rxjs/operators'
import CardChangelog from '../components/CardChangelog'
import PageTitle from '../components/PageTitle'
import { CHANGELOGS } from '../constants/collection'
import { DESC } from '../constants/order'
import { Changelog } from '../interfaces/models/changelog/changelog'
import { ChangelogUi } from '../interfaces/models/changelog/changelogUi'
import { createdAt } from '../libs/createdAt'
import { px } from '../libs/styles/px'
import { resetList } from '../libs/styles/resetList'
import { toVersionStr } from '../libs/toVersionStr'

const styles = ({ spacing }: Theme) => {
  return createStyles({
    changelogs: {
      ...resetList(),
      display: 'grid',
      gridRowGap: px(spacing.unit * 2),
      paddingLeft: spacing.unit * 2,
      paddingRight: spacing.unit * 2
    },
    progress: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: spacing.unit * 10
    },
    root: {
      display: 'grid',
      gridRowGap: px(spacing.unit * 2)
    }
  })
}

interface Props extends WithStyles<typeof styles> {}

interface State {
  changelogs: ChangelogUi[]
  inProgress: boolean
}

class PageChangelogs extends Component<Props> {
  public state: State = { changelogs: [], inProgress: true }

  private isUnmounted = false
  private subscription?: Subscription

  public render() {
    const { classes } = this.props
    const { changelogs, inProgress } = this.state
    if (inProgress) {
      return <CircularProgress className={classes.progress} />
    }
    return (
      <Fade in>
        <main className={classes.root}>
          <PageTitle
            hide={false}
            title={'アップデート履歴'}
            description={
              'バージョン3.0.0以降の過去のアップデート履歴を確認できます。'
            }
          />
          <ul className={classes.changelogs}>
            {changelogs.map(changelog => (
              <li key={changelog.id}>
                <CardChangelog
                  version={changelog.ui.version}
                  date={changelog.ui.date}
                  contents={changelog.contents}
                />
              </li>
            ))}
          </ul>
        </main>
      </Fade>
    )
  }

  public componentDidMount() {
    this.subscription = this.subscribe()
  }

  public componentWillUnmount() {
    this.isUnmounted = true
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  private subscribe() {
    const query = firestore()
      .collection(CHANGELOGS)
      .limit(40)
      .orderBy('version', DESC)
    return collectionData<Changelog>(query)
      .pipe(take(2))
      .subscribe(docs => {
        if (this.isUnmounted) {
          return
        }
        const changelogs = [
          ...docs.map(doc => ({
            ...doc,
            ui: {
              date: createdAt(doc.date, false),
              version: toVersionStr(doc.version)
            }
          }))
        ]
        this.setState({ changelogs, inProgress: false })
      })
  }
}

export default withStyles(styles)(PageChangelogs)
