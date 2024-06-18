import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { AddItemForm } from './AddItemForm';

//META
const meta = {
    title: 'TODOLISTS/AddItemForm',
    component: AddItemForm,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        addItem: {
            description: 'Button clicked inside form',
            action: 'clicked'
        }
    },
    args: {addItem: fn()},
} satisfies Meta<typeof AddItemForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AddItemForm1: Story = {};

// export const AddItemFormWithError: Story = {
//     render: () => <AddItemForm />
// };
