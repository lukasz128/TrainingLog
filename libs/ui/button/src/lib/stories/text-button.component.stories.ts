import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { TextButtonComponent } from '../components/text-button/text-button.component';

export default {
  title: 'TextButtonComponent',
  component: TextButtonComponent,
  decorators: [
    applicationConfig({
      providers: [],
    }),
    moduleMetadata({ imports: [] }),
  ],
  argTypes: {},
} as Meta<TextButtonComponent>;

type Story = StoryObj<TextButtonComponent>;

const PrimaryTemplate = (args: Story) => {
  return {
    props: { ...args },
    template: `
      <button ui-text-btn type='button'>Click me!</button>
    `,
  };
};

export const Primary = PrimaryTemplate.bind({});
