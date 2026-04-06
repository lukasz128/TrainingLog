import { Meta, StoryObj } from '@storybook/angular';
import { FilledButtonComponent } from 'ui/button';
import { InformationBannerComponent } from '../components/information-banner/information-banner.component';

export default {
  title: 'Information Banner',
  component: InformationBannerComponent,
  argTypes: {},
  decorators: [
    (story) => ({
      ...story(),
      moduleMetadata: {
        imports: [FilledButtonComponent],
      },
    }),
  ],
} as Meta<InformationBannerComponent>;

type Story = StoryObj<InformationBannerComponent>;

export const Primary: Story = {
  args: {
    title: 'Information',
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-information-banner [title]="title">
        <p>You have active exercise: FBW B</p>
        <button ui-filled-btn type="button">Go to exercise</button>
      </ui-information-banner>
    `,
  }),
};
