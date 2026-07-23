import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { CheckboxComponent } from '../components/checkbox/checkbox.component';

export default {
  title: 'Checkbox',
  component: CheckboxComponent,
  decorators: [
    moduleMetadata({
      imports: [CheckboxComponent, ReactiveFormsModule],
    }),
  ],
  argTypes: {},
} as Meta<CheckboxComponent>;

type Story = StoryObj<CheckboxComponent>;

const Template = (args: Story) => ({
  props: {
    ...args,
    checkedControl: new FormControl(true, { nonNullable: true }),
    uncheckedControl: new FormControl(false, { nonNullable: true }),
    disabledControl: new FormControl(
      { value: true, disabled: true },
      { nonNullable: true },
    ),
  },
  template: `
    <div style="display: grid; gap: 18px; padding: 24px; background: #0b0b0b; color: #fff;">
      <ui-checkbox [formControl]="checkedControl" ariaLabel="Completed set"></ui-checkbox>
      <ui-checkbox [formControl]="uncheckedControl" ariaLabel="Pending set"></ui-checkbox>
      <ui-checkbox [formControl]="disabledControl" ariaLabel="Disabled set"></ui-checkbox>
      <ui-checkbox [formControl]="uncheckedControl">Add label</ui-checkbox>
    </div>
  `,
});

export const Primary = Template.bind({});
