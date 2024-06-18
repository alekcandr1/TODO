import type { Meta, StoryObj } from '@storybook/react';
import AppWithRedux from '../AppWithRedux';
import { ReduxStoreProviderDecorator } from '../ReduxStoreProviderDecorator';

//META
const meta = {
    title: 'TODOLISTS/AppWithRedux',
    component: AppWithRedux,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [ReduxStoreProviderDecorator],
    args: {}
} satisfies Meta<typeof AppWithRedux>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AppWithReduxStory: Story = {};
