import { toDateText } from './toDateText'

describe('toDateText', () => {
  it('default', () => {
    const date = new Date('2020-02-02')

    const text = toDateText(date)

    expect(text).toBe('20200202')
  })
})
