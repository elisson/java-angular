import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { TasksService } from 'src/app/services/tasks.service';
import { MatSortModule, MatIconModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSnackBarModule, MatSelectModule, MatMenuModule, MatDialogModule } from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GenericModule } from 'src/app/components/v2/generic.module';
import { TablePlaceholderModule } from 'src/app/components/v2/table-placeholder/table-placeholder.module';
import { GenericTabDialogComponent } from 'src/app/components/v2/dialog/tab.component';
import { GenericDialogComponent } from 'src/app/components/v2/dialog/dialog.component';

@NgModule({
  declarations: [HomeComponent],
  exports: [HomeComponent],
  imports: [
    CommonModule,
    MatSortModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    GenericModule,
    TablePlaceholderModule,
    CommonModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatDialogModule,
  ],
  providers: [TasksService],
  entryComponents: [GenericDialogComponent, GenericTabDialogComponent]
})
export class HomeModule { }
