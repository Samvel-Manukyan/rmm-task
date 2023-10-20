import {Component, HostListener, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MenuCardComponent} from "../menu-card/menu-card.component";
import {ApiService, generateRandomItem, ItemInterface} from "@rmm-task/api";
import {Subscription} from "rxjs";
import {NgForOf} from "@angular/common";
import {capitalise} from "../../helpers/utils";

@Component({
  selector: 'libs-menu',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MenuCardComponent, NgForOf],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit, OnDestroy {
  selectedCard:WritableSignal<ItemInterface | null> = signal(null);
  cardList:WritableSignal<ItemInterface[]> = signal([]);
  selectedItemIndex = 0;
  sub = new Subscription();

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.sub.add(
      this.apiService.getAllItems$().subscribe(item => this.cardList.set(item))
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      const cardList = this.cardList();
      if (!this.selectedCard() && cardList.length) {
        this.selectedCard.set(cardList[this.selectedItemIndex] as ItemInterface);
      } else if (this.selectedCard() && this.selectedItemIndex < cardList.length - 1) {
        this.selectedCard.set(cardList[++this.selectedItemIndex] as ItemInterface)
      }
    } else if (event.key === 'ArrowLeft') {
      const cardList = this.cardList();
      if (!this.selectedCard() && cardList.length) {
        this.selectedCard.set(cardList[this.selectedItemIndex] as ItemInterface);
      } else if (this.selectedCard() && this.selectedItemIndex > 0) {
        this.selectedCard.set(cardList[--this.selectedItemIndex] as ItemInterface)
      }
    } else if (event.key === 'Backspace') {
      this.delete();
    } else if (event.key === 'Enter') {
      if (this.selectedCard()) {
        const cardName = this.selectedCard()?.name as string;
        alert(`Приложение ${capitalise(cardName)} запущено`)
      }
    }
  }

  /* I used this approach to optimise event handling, otherwise we simply can listen menu-card click event */
  onCardClick(target: EventTarget | null) {
    if (!target) {
      return;
    }

    const element = target as HTMLElement;
    const cardElement = element.tagName === 'MENU-CARD' ? element : element.closest('menu-card');
    const selectedCardBody = cardElement?.firstChild as HTMLElement;

    if (selectedCardBody) {
      this.selectedItemIndex = this.cardList()
        .findIndex(item => item.id === selectedCardBody.getAttribute('id'));

      if (this.selectedItemIndex > -1) {
        this.selectedCard.set(this.cardList()[this.selectedItemIndex] as ItemInterface);
      }
    }
  }

  addCard() {
    const newItem = generateRandomItem();
    this.apiService.addNewItem$(newItem).subscribe((item) => {
      this.cardList.set([...this.cardList(), item]);
    });
  }

  deleteCard() {
    this.delete();
  }

  delete() {
    const selectedCard = this.selectedCard();
    if (!selectedCard) {
      return;
    }

    const isDelete = confirm(`Are you sure you want to delete this ${capitalise(selectedCard.name)} item?`);
    if (isDelete) {
      this.selectedCard.set(null);
      this.apiService.deleteItem$(selectedCard).subscribe(() => {
        const deleteAccount = this.cardList().filter(
          (item) => item.id !== selectedCard.id
        );
        this.cardList.set(deleteAccount);

        if (this.cardList().length && this.selectedItemIndex > 0) {
          this.selectedCard.set(this.cardList()[--this.selectedItemIndex] as ItemInterface);
        } else if (this.cardList().length && this.selectedItemIndex === 0) {
          this.selectedCard.set(this.cardList()[this.selectedItemIndex] as ItemInterface);
        } else {
          this.selectedCard.set(null);
          this.selectedItemIndex = 0;
        }
      })
    }
  }

  trackByFn(_index: number, item: ItemInterface) {
    return item.id;
  }
}
