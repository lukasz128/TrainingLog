import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { IconsListComponent } from './icons-list/icons-list.component';

export default {
  title: 'IconsList',
  component: IconsListComponent,
  decorators: [
    applicationConfig({
      providers: [],
    }),
    moduleMetadata({ imports: [] }),
  ],
  argTypes: {},
} as Meta<IconsListComponent>;

type Story = StoryObj<IconsListComponent>;

const PrimaryTemplate = (args: Story) => {
  return {
    props: { ...args },
    template: `
      <ui-icons-list />
    `,
  };
};

export const Primary = PrimaryTemplate.bind({});
