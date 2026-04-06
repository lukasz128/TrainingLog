import { signal } from '@angular/core';
import { provideRouter, Route } from '@angular/router';
import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import {
  NAVBAR_ITEMS_TOKEN,
  NavbarComponent,
  NavbarItem,
} from '../components/navbar/navbar.component';

const routerMock: Route[] = [
  {
    path: 'dashboard',
  },
  {
    path: 'training',
  },
  {
    path: 'menu',
  },
];

const mockedNavbarItems: NavbarItem[] = [
  {
    id: 'Dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    highlight: false,
    href: '/instance/dashboard',
    type: 'link',
  },
  {
    id: 'Training',
    label: 'Training',
    icon: 'training',
    highlight: true,
    onPoint: () => {
      toggleTrainingItemActiveState();
    },
    isActive: true,
    type: 'action',
  },
  {
    id: ' Menu',
    label: 'Menu',
    icon: 'menu',
    highlight: false,
    href: '/instance/training',
    type: 'link',
  },
];

const mockedNavbarItemsSignal = signal(mockedNavbarItems);

const toggleTrainingItemActiveState = () =>
  mockedNavbarItemsSignal.update((value) => {
    const trainingNavbarItem = value.find((item) => item.id === 'Training');

    if (trainingNavbarItem?.type === 'action') {
      trainingNavbarItem.isActive = !trainingNavbarItem.isActive;
    }

    return value;
  });

export default {
  title: 'Navbar',
  component: NavbarComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideRouter([]),
        { provide: NAVBAR_ITEMS_TOKEN, useValue: mockedNavbarItemsSignal },
      ],
    }),
    moduleMetadata({
      imports: [],
    }),
  ],
  argTypes: {},
} as Meta<NavbarComponent>;

type Story = StoryObj<NavbarComponent>;

const PrimaryTemplate = (args: Story) => {
  return {
    props: {
      ...args,
    },

    template: `
      <ui-nav style="margin-top:30px;" /> 
    `,
  };
};

export const Primary = PrimaryTemplate.bind({});
