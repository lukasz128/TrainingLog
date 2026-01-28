import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { FilledButtonComponent } from '../components/filled-button/filled-button.component';

export default {
  title: 'FilledButtonComponent',
  component: FilledButtonComponent,
  decorators: [
    applicationConfig({
      providers: [],
    }),
    moduleMetadata({ imports: [] }),
  ],
  argTypes: {},
} as Meta<FilledButtonComponent>;

type Story = StoryObj<FilledButtonComponent>;

const PrimaryTemplate = (args: Story) => {
  return {
    props: { ...args },
    template: `
      <button ui-filled-btn type='button'>Click me!</button>
    `,
  };
};

export const Primary = PrimaryTemplate.bind({});
