import { Routes, RouterModule } from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';

import { AuthGuard } from '../guards/auth.guard';
import { SessionCancelGuard } from '../guards/cancel-session.guard';

import { WellnessStatusQuestionaireComponent } from './wellness-status-questionaire/wellness-status-questionaire.component';

import { ScanComponent } from './scan/scan.component';
import { ClientResolve } from './client-detail/client-detail.resolve.service';
import { CompleteSessionGuard } from '../guards/complete-session.guard';
import { FoundationsComponent } from './foundations/foundations.component';
import { FoundationDetailComponent } from './foundation-detail/foundation-detail.component';
import { SystemDetailComponent } from './system-detail/system-detail.component';
import { ActionPlansComponent } from './action-plans/action-plans.component';
import { ScanUploadComponent } from './scan-upload/scan-upload.component';
import { ScanStartComponent } from './scan-start/scan-start.component';

export const routes: Routes = [
    {
        path: 'pages',
        component: Pages,
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
                canActivate: [AuthGuard]
            },
            {
                path: 'dashboard',
                loadChildren: './dashboard/dashboard.module#DashboardModule',
                canActivate: [AuthGuard]
            },
            {
              path: "select-account",
              loadChildren:"./account-selection/account-selection.module#AccountSelectionModule"
            },
            {
              path: 'unauthorize/:reason',
              loadChildren:"./account-selection/account-selection.module#AccountSelectionModule"
              //pathMatch: 'full'
            },
            {
                path: 'clients',
                loadChildren: './clients/clients.module#ClientsModule',
                canActivate: [AuthGuard]
            },
            {
                path: 'client',
                loadChildren: './client/client.module#ClientModule',
                canActivate: [AuthGuard]
            },
            {
                path: 'client/:id/client-edit',
                loadChildren: './client/client.module#ClientModule',
                canActivate: [AuthGuard],
                resolve: {
                    client: ClientResolve,
                }
            },
            {
                path: 'client/:id/client-detail',
                loadChildren:
                    './client-detail/client-detail.module#ClientDetailModule',
                canActivate: [AuthGuard],
                resolve: {
                    client: ClientResolve,
                }
            },
            {
                path: 'client/:id/sessions/:pid/wellness-status-questionnaire',
                component: WellnessStatusQuestionaireComponent,
                canActivate: [AuthGuard],
                canDeactivate: []
            },
            {
                path: 'sessions/:pid/foundations',
                component: FoundationsComponent,
                canActivate: [AuthGuard],
                canDeactivate: []
            },
            {
                path: 'sessions/:pid/foundations/:fid/detail',
                component: FoundationDetailComponent,
                canActivate: [AuthGuard],
                canDeactivate: []
            },
            {
                path: 'sessions/:pid/foundations/:fid/system/:sid/detail',
                component: SystemDetailComponent,
                canActivate: [AuthGuard],
                canDeactivate: []
            },
            {
                path: 'sessions/:pid/action-plan',
                component: ActionPlansComponent,
                canActivate: [AuthGuard],
                canDeactivate: []
            },
          
            {
                path: 'client/:id/scan',
                component: ScanComponent,
                canActivate: [AuthGuard],
                canDeactivate: []
            },
            
            {
                path: 'client/:id/sessions/:pid/scan',
                component: ScanComponent,
                canActivate: [AuthGuard],
                canDeactivate: []
            },
            {
                path: 'client/:id/sessions/:pid/scan-upload',
                component: ScanUploadComponent,
                canActivate: [AuthGuard],
                canDeactivate: []
            },
            {
                path: 'client/:id/sessions/:pid/facial/scan/:fid',
                component: ScanStartComponent,
                canActivate: [AuthGuard],
                canDeactivate: []
            },
            {
                path: 'client/:id/orders',
                loadChildren: './orders/orders.module#OrdersModule',
                canActivate: [AuthGuard]
            },
            {
                path: 'client/:id/order/:oid',
                loadChildren:
                    './order-detail/order-detail.module#OrderDetailModule',
                canActivate: [AuthGuard],
            },
            {
                path: 'client/:id/session-history',
                loadChildren:
                    './session-history/session-history.module#SessionHistoryModule',
                canActivate: [AuthGuard]
            },
            
            {
                path: 'sessions/:pid/action-plan-print',
                loadChildren:
                    './print-screen/print-screen.module#PrintScreenModule',
                canActivate: [AuthGuard],
            },
            {
                path: 'client/:id/sessions/:sid/checkout-cart/:sale-order-id',
                loadChildren:
                    './checkout-cart/checkout-cart.module#CheckoutCartModule',
                canActivate: [AuthGuard],
            },
            {
                path: 'client/:id/sessions/:sid/checkout-summary/:sale-order-id',
                loadChildren:
                    './checkout-summary/checkout-summary.module#CheckoutSummaryModule',
                canActivate: [AuthGuard],
            },
            {
                path: 'client/:id/sessions/:sid/checkout-complete/:sale-order-id',
                loadChildren:
                    './checkout-complete/checkout-complete.module#CheckoutCompleteModule',
                canActivate: [AuthGuard],
            },
            {
                path: 'account',
                loadChildren: './account/account.module#AccountModule',
                canActivate: [AuthGuard],
            },
            {
                path: 'account/device',
                loadChildren:
                    './zyto-setting/zyto-setting.module#ZytoSettingModule',
                canActivate: [AuthGuard],
            },
            {
                path: 'account/edit',
                loadChildren:
                    './edit-account/edit-account.module#EditAccountModule',
                canActivate: [AuthGuard]
            },
            {
                path: 'account/services',
                loadChildren: './services/services.module#ServicesModule',
                canActivate: [AuthGuard]
            },
            {
                path: 'account/plan',
                loadChildren: './plan/plan.module#PlanModule',
                canActivate: [AuthGuard]
            },
            {
                path: 'account/plan-edit',
                loadChildren: './plan-edit/plan-edit.module#PlanEditModule',
                canActivate: [AuthGuard]
            },
            {
                path: 'account/plan-upgrade',
                loadChildren: './plan-upgrade/plan-upgrade.module#PlanUpgradeModule',
                canActivate: [AuthGuard]
            },
            {
                path: 'account/manager',
                loadChildren: './account-manager/account-manager.module#AccountManagerModule',
                canActivate: [AuthGuard]
            },
            {
                path: 'account/billing',
                loadChildren: './billing/billing.module#BillingModule',
                canActivate: [AuthGuard]
            },
            {
                path: 'support',
                loadChildren: './about/about.module#AboutModule',
                canActivate: [AuthGuard]
            }
        ]
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
