import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { UserProfile } from '../core/user-profile.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private itemDoc: AngularFirestoreDocument<UserProfile>;
  private item: Observable<UserProfile>;
  private uid: string;
  public loading = false;
  public error: string;
  constructor(public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private route: ActivatedRoute,
    private auth: AuthService) {
    this.uid = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.itemDoc = this.afs.doc<UserProfile>(`users/${this.uid}`);
    this.item = this.itemDoc.valueChanges();
  }

  async onSubmit(ngForm: NgForm) {
    this.loading = true;
    const {
      email,
      name,
      address,
      city,
      state,
      zip,
      ip,
      phone,
      specialty
    } = ngForm.form.getRawValue();

    const userProfile: UserProfile = {
      uid: this.uid,
      email,
      name,
      address,
      city,
      state,
      zip,
      ip,
      phone,
      specialty
    };

    try {
      await this.auth.updateUserDocument(userProfile);
    } catch(error) {
      console.log(error.message);
      this.error = error.message;
    }
    this.loading = false;
  }

}
