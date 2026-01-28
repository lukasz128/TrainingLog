import { provideHttpClient } from '@angular/common/http';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { LabelComponent } from 'ui/common';
import { InputDirective } from 'ui/input';
import { FormErrorComponent } from '../components/form-error/form-error.component';
import { FormFieldComponent } from '../components/form-field/form-field.component';
export default {
  title: 'FormField',
  component: FormFieldComponent,
  decorators: [
    applicationConfig({
      providers: [provideHttpClient()],
    }),
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        LabelComponent,
        InputDirective,
        FormErrorComponent,
      ],
    }),
  ],
  argTypes: {},
} as Meta<FormFieldComponent>;

type Story = StoryObj<FormFieldComponent>;

const PrimaryTemplate = (args: Story) => {
  return {
    props: { ...args, formControl: new FormControl('test') },
    template: `
      <ui-form-field>
        <ui-label>email</ui-label> 

        <input uiInput [formControl]="formControl" placeholder="Enter the email" />
      </ui-form-field>
    `,
  };
};

const ValidTemplate = (args: Story) => {
  return {
    props: {
      ...args,
      formControl: new FormControl('sdfs', {
        validators: [Validators.required, Validators.email],
      }),
    },
    template: `
      <ui-form-field>
        <ui-label>email</ui-label> 

        @if(formControl.invalid && formControl.touched) {
          <ui-form-error> field is required </ui-form-error>
        }

        <input uiInput [formControl]="formControl" placeholder="Enter the email" />
      </ui-form-field>
    `,
  };
};

export const Primary = PrimaryTemplate.bind({});
export const Valid = ValidTemplate.bind({});
