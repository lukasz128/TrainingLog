import { Meta, StoryObj } from '@storybook/angular';
import { ExerciseSheetComponent } from '../../../../strength-instance/src/lib/components/exercise-sheet/exercise-sheet.component';

export default {
  title: 'Strength/Exercise Sheet',
  component: ExerciseSheetComponent,
  argTypes: {},
} as Meta<ExerciseSheetComponent>;

type Story = StoryObj<ExerciseSheetComponent>;

export const Primary: Story = {
  args: {
    sets: [
      { done: true, weight: '60', reps: '6' },
      { done: true, weight: '70', reps: '6' },
      { done: false, weight: '80', reps: '6' },
      { done: false, weight: '90', reps: '4' },
      { done: false, weight: '85', reps: '6' },
    ],
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 520px; padding: 24px; background: #0b0b0b; color: #fff;">
        <strength-exercise-sheet [sets]="sets"></strength-exercise-sheet>
      </div>
    `,
  }),
};
