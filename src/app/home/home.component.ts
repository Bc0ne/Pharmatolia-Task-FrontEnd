import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { UserService } from '../_services/user-service.service';
import { User } from '../_models/user.model';
import { TokenValues } from '../_models/token-values';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  modalRef: BsModalRef;
  integers: string;
  amount: number;
  message: string;

  constructor(private userService: UserService, private modalService: BsModalService, private router: Router) { }

  ngOnInit() {
      this.getUser();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
  }

  updateProfile() {
    const userId = JSON.parse(localStorage.getItem(TokenValues.UserId));
    this.userService.updateUserById(userId, {firstName: this.userService.user.firstName, lastName: this.userService.user.lastName })
      .subscribe((data: any) => {
        this.closeModal();
      });
  }

  getUser() {
    const userId = JSON.parse(localStorage.getItem(TokenValues.UserId));
    this.userService.user = new User();
    this.userService.getUserById(userId).subscribe((data: any) => {
      this.userService.user.firstName = data.firstName;
      this.userService.user.lastName = data.lastName;
      this.userService.user.email = data.email;
      this.userService.user.photoUrl = data.photoUrl;
    });
  }

  signOut(){
    this.userService.logOut();
    this.router.navigate(['login']);
  }

  findTwoIntegers() {
    let integers = this.integers.split(',').map(Number);

    if (this.isDistincArray(integers)) {
      this.findTwoItems(integers);
    } else {
      this.message = "Integers aren't distinct.";
    }
  }

  isDistincArray(integers) {
    for (let i = 0; i < integers.length; i++) {
      for (let j = 0; j < integers.length && i != j; j++) {
        if (integers[i] === integers[j]) {
          return false;
        }
      }
    }
    return true;
  }

  findTwoItems(integers) {
    for (let i = 0; i < integers.length; i++) {
      for (let j = 0; j < integers.length && i != j; j++) {
        if (integers[i] + integers[j] == this.amount) {
          this.message = `You should take [${integers[i]}, ${integers[j]}]`;
          return;
        }
      }
    }
  }

}
