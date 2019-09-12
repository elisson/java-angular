import { Component, ViewEncapsulation } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TasksService, ITask } from 'src/app/services/tasks.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { GenericTabDialogComponent } from 'src/app/components/v2/dialog/tab.component';
import { IGenericFormItem } from 'src/app/components/v2/validators';
import { Validators } from '@angular/forms';
import { GenericDialogComponent } from 'src/app/components/v2/dialog/dialog.component';
/**
 * @title Drag&Drop connected sorting
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent {
  todo = [];
  done = [];
  constructor(
    public md: MatDialog
    , public ms: MatSnackBar
    , private taskService: TasksService
  ) {
    this.reloadFromServer();
  }

  reloadFromServer = () => {
    this.todo = [];
    this.done = [];
    this.taskService.fetch().subscribe((all: []) => (all || []).map((i: ITask) => {
      if (i.status === 0) {
        this.todo.push(i);
      } else {
        this.done.push(i);
      }
    }))
  }

  drop(event: CdkDragDrop<string[]>) {
    // item.loading = true;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      // item.loading = false;
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
        // item.loading = false;
      }
    const task: ITask = event.container.data[event.currentIndex] as any;
    task.status = event.container.id === 'done' ? 1 : 0;
    task.sort = event.currentIndex;
    this.taskService.update(task.id, task).subscribe(() => {
    })
  };

  // onSave = item => {
  //   console.log(item);
  //   this.todo.unshift(item);
  // };

  // remove = (item) => {
  //   const workArray = (item.status === 0 ? 'todo' : 'done');
  //   this[workArray] = this[workArray].filter(i => i.id !== item.id);
  //   // this.taskService.remove(id);
  //   console.log(item, this[workArray]);
  // };

  add(model: ITask = {} as ITask) {
    this.md.open(GenericTabDialogComponent, {
      panelClass: 'col-md-6',
      data: {
        title: 'Novo registro',
        tabs: [
          {
            save: (data, { componentInstance }) => componentInstance.dialogRef.close(data)
            , input: <IGenericFormItem[]>[
              {
                ngClass: 'col-md-9'
                , label: 'task.title'
                , formControlName: 'title'
                , validators: Validators.required
                , value: model.title
              }
              , {
                ngClass: 'col-md-3'
                , label: 'task.status'
                , formControlName: 'status'
                , validators: [Validators.required]
                , value: model.status
                , type: 'select'
                , options: [{ value: 0, viewValue: 'task.afazer' }, { value: 1, viewValue: 'task.feito' }]
              }
            ]
          }
        ]
      }
    })
      .afterClosed().subscribe(res => {
        if (res) {
          this.ms.open('Processando...', null, { horizontalPosition: 'left' });

          this.taskService.store(res).subscribe((task: ITask) => {
            this.reloadFromServer();
            this.ms.open('Você acabou de gravar um registro!', null, { horizontalPosition: 'left', duration: 2000 });
          }, err => {
            this.ms.open(err.error.message, 'TENTAR NOVAMENTE', { duration: 5800 }).onAction().subscribe(() => {
              this.add(res);
            });
          });
        }
      });
  };

  edit(model: ITask = {} as ITask) {
    this.md.open(GenericTabDialogComponent, {
      panelClass: 'col-md-6',
      data: {
        title: 'Editar registro',
        tabs: [
          {
            save: (data, { componentInstance }) => componentInstance.dialogRef.close(data)
            , input: <IGenericFormItem[]>[
              {
                ngClass: 'col-md-9'
                , label: 'task.title'
                , formControlName: 'title'
                , validators: Validators.required
                , value: model.title
              }
              , {
                ngClass: 'col-md-3'
                , label: 'task.status'
                , formControlName: 'status'
                , validators: [Validators.required]
                , value: !isNaN(model.status as any) ? Number(model.status) : 0
                , type: 'select'
                , options: [{ value: 0, viewValue: 'task.afazer' }, { value: 1, viewValue: 'task.feito' }]
              }
            ]
          }
        ]
      }
    })
      .afterClosed().subscribe(res => {
        if (res) {
          this.ms.open('Processando...', null, { horizontalPosition: 'left' });
          this.taskService.update(model.id as number, res).subscribe(server => {
            this.reloadFromServer();
            this.ms.open('Você acabou de atualizar um registro!', null, { horizontalPosition: 'left', duration: 2000 });
          }, err => {
            this.ms.open(err.error.message, 'TENTAR NOVAMENTE', { duration: 5800 }).onAction().subscribe(() => {
              this.edit(res);
            });
          });
        }
      });
  };

  destroy(model: ITask = {} as ITask) {
    this.md.open(GenericDialogComponent, {
      panelClass: 'col-md-4',
      data: {
        confirm: true, html: `<h5>Excluir definitivamente o registro ${model.title} ?</h5>`
      }
    }).afterClosed().subscribe(res => {
      if (res) {
        this.ms.open('Processando...', null, { horizontalPosition: 'left' });
        this.taskService.destroy(model.id).subscribe(() => {
          this.reloadFromServer();
          this.ms.open('Você acabou de remover um registro!', null, { horizontalPosition: 'left', duration: 2000 });
        }, err => {
          this.ms.open(err.error.message, 'TENTAR NOVAMENTE', { duration: 5800 }).onAction().subscribe(() => {
            this.destroy(model);
          });
        });
      }
    });
  }

}

