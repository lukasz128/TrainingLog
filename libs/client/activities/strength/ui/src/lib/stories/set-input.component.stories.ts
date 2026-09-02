import { FormsModule } from '@angular/forms';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { SetInputComponent } from '../../../../strength-instance/src/lib/components/set-input/set-input.component';

export default {
  title: 'Strength/Set Input',
  component: SetInputComponent,
  decorators: [
    moduleMetadata({
      imports: [FormsModule, SetInputComponent],
    }),
  ],
  argTypes: {},
} as Meta<SetInputComponent>;

type Story = StoryObj<SetInputComponent>;

const Template = (args: Story) => ({
  props: {
    ...args,
    weight: '60',
    reps: '6',
  },
  template: `
    <div style="display: grid; grid-template-columns: 100px 100px; gap: 16px; padding: 24px; background: #0b0b0b;">
      <strength-set-input [(ngModel)]="weight" suffix="kg" ariaLabel="Weight"></strength-set-input>
      <strength-set-input [(ngModel)]="reps" suffix="powt" ariaLabel="Repetitions"></strength-set-input>
    </div>
  `,
});

export const Primary = Template.bind({});
