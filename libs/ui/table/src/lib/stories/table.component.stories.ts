import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { UiTableComponent } from '../components/table/table.component';
import { UiColumnDefDirective } from '../components/table/table-column-def.directive';
import { UiHeaderCellDefDirective } from '../components/table/table-header-cell-def.directive';
import { UiCellDefDirective } from '../components/table/table-cell-def.directive';
import { UiHeaderRowDefDirective } from '../components/table/table-header-row-def.directive';
import { UiRowDefDirective } from '../components/table/table-row-def.directive';

const rows = [
  { date: '10.12.2025', time: '20:45', title: 'FBW B (dominacja plecy)' },
  { date: '08.12.2025', time: '21:30', title: 'FBW C' },
  { date: '06.12.2025', time: '21:13', title: 'FBW A (dominacja klata)' },
];

export default {
  title: 'UiTableComponent',
  component: UiTableComponent,
  decorators: [
    applicationConfig({ providers: [] }),
    moduleMetadata({
      imports: [
        UiTableComponent,
        UiColumnDefDirective,
        UiHeaderCellDefDirective,
        UiCellDefDirective,
        UiHeaderRowDefDirective,
        UiRowDefDirective,
      ],
    }),
  ],
  argTypes: {},
} as Meta<UiTableComponent>;

type Story = StoryObj<UiTableComponent>;

const PrimaryTemplate = (args: Story) => {
  return {
    props: {
      ...args,
      rows,
      columns: ['date', 'time', 'title', 'action'],
      columnSizes: ['140px', '90px', '1fr', '36px'],
    },
    template: `
      <div class="demo-shell">
        <ui-table
          [data]="rows"
          [columns]="columns"
          [columnSizes]="columnSizes"
        >
          <tr *uiHeaderRowDef="columns"></tr>
          <tr *uiRowDef="let row; columns: columns;"></tr>

          <ng-container uiColumnDef="date">
            <ng-template uiHeaderCellDef>
              <svg class="demo-icon" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <rect x="7" y="14" width="3" height="3"></rect>
                <rect x="12" y="14" width="3" height="3"></rect>
              </svg>
            </ng-template>
            <ng-template uiCellDef let-row>{{ row.date }}</ng-template>
          </ng-container>

          <ng-container uiColumnDef="time">
            <ng-template uiHeaderCellDef>
              <svg class="demo-icon" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 7v6l4 2"></path>
              </svg>
            </ng-template>
            <ng-template uiCellDef let-row>{{ row.time }}</ng-template>
          </ng-container>

          <ng-container uiColumnDef="title">
            <ng-template uiHeaderCellDef>
              <svg class="demo-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"></path>
              </svg>
            </ng-template>
            <ng-template uiCellDef let-row>{{ row.title }}</ng-template>
          </ng-container>

          <ng-container uiColumnDef="action">
            <ng-template uiHeaderCellDef>
              <span class="demo-header-spacer"></span>
            </ng-template>
            <ng-template uiCellDef>
              <svg class="demo-chevron" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 6l6 6-6 6"></path>
              </svg>
            </ng-template>
          </ng-container>
        </ui-table>
      </div>
    `,
    styles: [
      `
        .demo-shell {
          background: #111111;
          padding: 20px 18px 10px;
          max-width: 920px;
        }

        ui-table {
          --ui-table-text-color: #f4f4f4;
          --ui-table-font-family: 'Montserrat', sans-serif;
          --ui-table-column-gap: 28px;
          --ui-table-header-divider: rgba(255, 255, 255, 0.75);
          --ui-table-row-divider: rgba(255, 255, 255, 0.08);
          --ui-table-cell-font-size: 20px;
          --ui-table-header-font-size: 14px;
        }

        .demo-icon {
          width: 22px;
          height: 22px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
        }

        .demo-chevron {
          width: 20px;
          height: 20px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2.5;
        }

        .demo-header-spacer {
          display: block;
          width: 24px;
          height: 24px;
        }
      `,
    ],
  };
};

export const Primary = PrimaryTemplate.bind({});
