import { Injectable } from '@angular/core';
import { UserDetails, usersList } from '../../DTO/users.dto';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor() { }

  getAllUsers = (): Array<UserDetails> => usersList
}
