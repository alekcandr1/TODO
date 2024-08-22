import type { Meta, StoryObj } from "@storybook/react"
import App from "./App"
import { ReduxStoreProviderDecorator } from "../ReduxStoreProviderDecorator"

//META
const meta = {
  title: "TODOLISTS/AppWithRedux",
  component: App,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [ReduxStoreProviderDecorator],
  args: {},
} satisfies Meta<typeof App>

export default meta
type Story = StoryObj<typeof meta>

export const AppWithReduxStory: Story = {}
