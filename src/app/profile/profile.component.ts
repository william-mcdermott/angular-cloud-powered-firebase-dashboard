import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
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
  public downloadUrl: Observable<string>;
  public uploadProgress: Observable<number>;

  constructor(public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private route: ActivatedRoute,
    private auth: AuthService,
    private afStorage: AngularFireStorage
  ) {
    this.uid = this.route.snapshot.paramMap.get('id');
    this.downloadUrl = this.afStorage
      .ref(`users/${this.uid}/profile-image`)
      .getDownloadURL();
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

  fileChange(event) {
    this.downloadUrl = null;
    this.error = null;
    const file = event.target.files[0];
    const filePath = `users/${this.uid}/profile-image`;
    const fileRef = this.afStorage.ref(filePath);
    const task = this.afStorage.upload(filePath, file);
    task.catch(error => this.error = error.message);
    this.uploadProgress = task.percentageChanges();
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadUrl = fileRef.getDownloadURL();
        })
      )
      .subscribe();
  }

}
