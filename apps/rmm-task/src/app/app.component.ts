import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '@rmm-task/menu';

@Component({
  standalone: true,
  imports: [MenuComponent, RouterModule],
  selector: 'rmm-task-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'rmm-task';
}
