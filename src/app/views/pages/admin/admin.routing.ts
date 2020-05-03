import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminProductComponent } from './admin-product/admin-product.component';

export const AdminRoutingModule: Routes = [
    { path: '', component: AdminComponent,
        children: [
            { path: 'product', component: AdminProductComponent},
        ]

    }
    
];
