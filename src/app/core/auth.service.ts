import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserProfile } from './user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private afAuth: AngularFireAuth, private afs: AngularFirestore) { }

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(['']);
  }

  isLoggedIn() {
    return !!this.afAuth.auth.currentUser;
  }

  createUserDocument() {
    const user = this.afAuth.auth.currentUser;
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      address: '',
      city: '',
      state: '',
      zip: '',
      specialty: '',
      ip: '',
      phone: ''
    };
    this.afs.doc(`users/${user.uid}`).set(userProfile);
  }

  updateUserDocument(userProfile: UserProfile) {
    return this.afs.doc(`users/${userProfile.uid}`).update(userProfile);
  }

  async routeOnLogin() {
    const user = this.afAuth.auth.currentUser;
    const token = await user.getIdTokenResult();

    if (token.claims.admin) {
      this.router.navigate(['/users']);
    } else {
      this.router.navigate([`/profile/${user.uid}`]);
    }
  }
}
