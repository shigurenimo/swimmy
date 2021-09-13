import { Divider, Stack, Toolbar, Typography } from '@mui/material'
import React, { FunctionComponent } from 'react'
import { FragmentHead } from 'src/core/components/FragmentHead'
import { useAnalytics } from 'src/core/hooks/useAnalytics'

export const MainPrivacy: FunctionComponent = () => {
  useAnalytics()

  return (
    <Stack spacing={1}>
      <FragmentHead title={'プライバシーポリシー'} />
      <Toolbar />
      <Divider />
      <Stack p={2} spacing={1}>
        <Typography variant={'h6'} component={'h2'}>
          個人情報について
        </Typography>
        <Typography sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>
          個人情報とは、このサービスを利用するユーザの情報のうち、メールアドレスなど、個人を特定できる情報をいいます。
          また、他の情報と容易に照合でき、それにより個人を特定できる情報も含みます。
        </Typography>
      </Stack>
      <Divider />
      <Stack p={2} spacing={1}>
        <Typography variant={'h6'} component={'h2'}>
          個人情報の管理と利用
        </Typography>
        <Typography sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>
          Swimmyは、ログイン認証にメールアドレスの利用を希望するユーザのメールアドレスを管理します。
          Swimmyは、ユーザのログイン認証のみにメールアドレスを利用します。
        </Typography>
      </Stack>
      <Divider />
      <Stack p={2} spacing={1}>
        <Typography variant={'h6'} component={'h2'}>
          個人情報の提供
        </Typography>
        <Typography sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>
          Swimmyは、個人情報を第三者に提供しません。
        </Typography>
      </Stack>
      <Divider />
      <Stack p={2} spacing={1}>
        <Typography variant={'h6'} component={'h2'}>
          Cookieの使用
        </Typography>
        <Typography sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>
          Swimmyは、Google
          Analyticsを使用しトラフィックデータの収集のためにCookieを使用します。
          これは匿名で収集されており、個人を特定するものではありません。
        </Typography>
      </Stack>
      <Divider />
      <Stack p={2} spacing={1}>
        <Typography variant={'h6'} component={'h2'}>
          プライバシーポリシーへの同意
        </Typography>
        <Typography sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>
          ユーザがこのサービスを利用することで、このプライバシーポリシーに同意したものとします。
        </Typography>
      </Stack>
    </Stack>
  )
}
