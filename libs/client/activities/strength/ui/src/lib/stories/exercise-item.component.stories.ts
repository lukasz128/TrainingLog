import { Meta, StoryObj } from '@storybook/angular';
import { ExerciseItemComponent } from '../../../../strength-instance/src/lib/components/exercise-item/exercise-item.component';
import { ExerciseLinkingComponent } from '../../../../strength-instance/src/lib/components/exercise-linking/exercise-linking.component';

export default {
  title: 'Strength/Exercise Item',
  component: ExerciseItemComponent,
  argTypes: {},
} as Meta<ExerciseItemComponent>;

type Story = StoryObj<ExerciseItemComponent>;

export const Primary: Story = {
  args: {
    data: {
      title: 'Wyciskanie sztangi na lawce plaskiej',
      phase: 'progress',
      details: '3×4-6 | 1/0/1/0',
    },
    progress: '1/4',
  },
  render: (args) => ({
    props: args,
    imports: [ExerciseLinkingComponent],
    template: `
      <div style="background:#111; padding:16px;">
        <strength-exercise-item
          [data]="data"
          [progress]="progress"
        ></strength-exercise-item>
        <strength-exercise-linking></strength-exercise-linking>

        <strength-exercise-item
          [data]="data"
          [progress]="progress"
        ></strength-exercise-item>
      </div>
    `,
  }),
};

export const WithoutLink: Story = {
  args: {
    data: {
      title: 'Podciaganie podchwytem',
      phase: 'progress',
      details: '3×12/10-8/6-6/8',
    },
    progress: '3/4',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="background:#111; padding:16px; max-width:420px;">
        <strength-exercise-item
          [data]="data"
          [progress]="progress"
        ></strength-exercise-item>
      </div>
    `,
  }),
};
