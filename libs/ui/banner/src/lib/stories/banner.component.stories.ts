import { Meta, StoryObj } from '@storybook/angular';
import { FilledButtonComponent } from 'ui/button';
import { BannerComponent } from '../components/banner/banner.component';

export default {
  title: 'Banner',
  component: BannerComponent,
  argTypes: {},
  decorators: [
    (story) => ({
      ...story(),
      moduleMetadata: {
        imports: [FilledButtonComponent],
      },
    }),
  ],
} as Meta<BannerComponent>;

type Story = StoryObj<BannerComponent>;

export const Primary: Story = {
  args: {
    title: 'Information',
    icon: 'info',
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-banner [title]="title" [icon]="icon">
        <p>You have active exercise: FBW B</p>
        <button ui-filled-btn type="button">Go to exercise</button>
      </ui-banner>
    `,
  }),
};

export const CustomColors: Story = {
  args: {
    title: 'Warning',
    icon: 'info',
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-banner
        [title]="title"
        [icon]="icon"
        style="--banner-bg:#211606; --banner-accent:#f5b041; --banner-text:#fff7e6;"
      >
        <p>Your plan expires soon.</p>
        <button ui-filled-btn type="button">Renew now</button>
      </ui-banner>
    `,
  }),
};
