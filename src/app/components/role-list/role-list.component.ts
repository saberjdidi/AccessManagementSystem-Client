import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { Role } from '../../interfaces/role';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css'
})
export class RoleListComponent {
 @Input({required: true}) roles!: Role[] | null;
 @Output() deleteRole: EventEmitter<string> = new EventEmitter<string>();

 deleteFn(id: string){
  this.deleteRole.emit(id);
 }
}
