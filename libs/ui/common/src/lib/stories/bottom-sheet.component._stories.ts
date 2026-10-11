import { Meta, StoryObj } from '@storybook/angular';
import { BottomSheetComponent } from '../components/bottom-sheet/bottom-sheet.component';
import { BottomSheetDemoContentComponent } from './bottom-sheet-demo-content.component';

export default {
  title: 'Bottom Sheet',
  component: BottomSheetComponent,
  argTypes: {},
} as Meta<BottomSheetComponent>;

type Story = StoryObj<BottomSheetComponent>;

export const ExerciseStyle: Story = {
  args: {
    open: true,
    title: 'Wyciskanie sztangi na lawce plaskiej',
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [BottomSheetComponent, BottomSheetDemoContentComponent],
    },
    template: `
      <div style="height: 100vh; background: linear-gradient(180deg, #1d1e22 0%, #1f2028 100%);">
        <ui-bottom-sheet [open]="open" [title]="title">
          <ui-bottom-sheet-demo-content />
        </ui-bottom-sheet>
      </div>
    `,
  }),
};

export const ClosedState: Story = {
  args: {
    open: false,
    title: 'Bottom sheet hidden',
  },
};
