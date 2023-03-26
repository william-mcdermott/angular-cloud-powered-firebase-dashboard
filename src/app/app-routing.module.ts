import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { map } from 'rxjs/operators';
import { AngularFireAuthGuard, customClaims, redirectUnauthorizedTo } from '@angular/fire/auth-guard'
import { UsersComponent } from './users/users.component';
import { pipe } from 'rxjs';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo([''])
const redirectLoggedInToProfile = () =>
  map(user => user ? ['profile', (user as any).uid]: true);

const onlyAllowSelf = next =>
  map(
    user => (!!user && next.params.id === (user as any).uid || [''])
  );

const adminOnly = () => pipe(
  customClaims,
  map(claims => claims['admin'] === true || [''])
);

const redirectLoggedInToProfileOrUsers = () =>
  pipe(
    customClaims,
    map(claims => {
      if (claims.length === 0) {
        return true;
      } else if (claims.admin) {
        return ['users'];
      }
      return ['profile', claims.user_id]
    })
  )

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToProfileOrUsers }
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: onlyAllowSelf }
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: adminOnly }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
