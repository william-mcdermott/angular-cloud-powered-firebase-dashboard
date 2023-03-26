import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserProfile } from '../core/user-profile.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  private usersCollection: AngularFirestoreCollection<UserProfile>;
  public users: Observable<UserProfile[]>;
  constructor(private afs: AngularFirestore) {
    this.usersCollection = afs.collection<UserProfile>('users');
    this.users = this.usersCollection.valueChanges();
  }

  ngOnInit() {
  }

}
