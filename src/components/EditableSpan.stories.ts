import type { Meta, StoryObj } from '@storybook/react';
import { EditableSpan } from './EditableSpan';
import { fn } from '@storybook/test';

//META
const meta = {
    title: 'TODOLISTS/EditableSpan',
    component: EditableSpan,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {

    },
    args: {
        // title: string,
        onChange: fn()
    },
} satisfies Meta<typeof EditableSpan>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EditableSpan1: Story = {
    args: {
        title: 'Text',
    }
};
