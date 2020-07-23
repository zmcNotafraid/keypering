import type { Channel } from '@keypering/specs'

export const isSuccessResponse = (res: { code: Channel.Code }): res is Channel.SuccessResponse => res.code === 0
export default undefined
