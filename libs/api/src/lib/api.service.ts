import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { animals, uniqueNamesGenerator } from 'unique-names-generator';
import { v4 as uuidv4 } from 'uuid';
import { icons, ItemInterface } from './api.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiPath = 'http://localhost:3000/applications';

  constructor(private http: HttpClient) {}

  public getAllItems$(): Observable<ItemInterface[]> {
    return this.http.get<ItemInterface[]>(this.apiPath);
  }

  public addNewItem$(item: ItemInterface): Observable<ItemInterface> {
    return this.http.post<ItemInterface>(this.apiPath, item);
  }

  public deleteItem$(item: ItemInterface) {
    return this.http.delete(`${this.apiPath}/${item.id}`);
  }
}

export const generateRandomItem = (): ItemInterface => {
  return {
    id: uuidv4(),
    name: uniqueNamesGenerator({ dictionaries: [animals] }),
    icon: icons[Math.floor(Math.random() * icons.length)] || 'android',
  };
};
