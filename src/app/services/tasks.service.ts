
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GenericService } from '../components/v2/service/service';

export interface ITask {
    id?: number;
    title: string;
    status: number;
    sort?: number;
};

@Injectable()
export class TasksService extends GenericService {
    public url = new URL(environment.baseURL.concat('tasks'));
    public params: any = {
        'title': { type: 'string', nullable: false, queryType: 'contains' }
    };
    constructor(public http: HttpClient) { super(http); }
}
