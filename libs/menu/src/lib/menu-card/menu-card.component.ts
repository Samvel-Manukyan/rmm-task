import {Component, Input} from "@angular/core";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {ItemInterface} from "@rmm-task/api";
import {NgForOf, TitleCasePipe} from "@angular/common";

@Component({
  selector: 'menu-card',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, NgForOf, TitleCasePipe],
  templateUrl: './menu-card.component.html',
  styleUrls: ['./menu-card.component.css'],
})
export class MenuCardComponent {
  @Input() isSelected = false;
  @Input({required: true}) card!: ItemInterface;
}
