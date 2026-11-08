import type { esMessages } from './messages/es'

export type UiMessageKey = keyof typeof esMessages

export type MessageParams = Record<string, string | number>

export type UiMessages = Record<UiMessageKey, string>
