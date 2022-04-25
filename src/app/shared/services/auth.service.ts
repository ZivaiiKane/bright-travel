import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user';

import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null | undefined>;

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async googleSignin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);

    if (!credential?.user) {
      return;
    }

    const userData: User = {
      ...credential.user,
      email: credential.user.email || '',
      displayName: credential.user.displayName || '',
      photoURL: credential.user.photoURL || '',
      uid: credential.user.uid || '',
      emailVerified: credential.user.emailVerified || false,
    };

    this.updateUserData(userData);

    this.router.navigate(['dashboard']);
  }

  async signUpWithEmail(email: string, password: string, username: string) {
    const result = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );

    if (!result?.user) {
      return;
    }

    const userData: User = {
      ...result.user,
      email: result.user.email || '',
      displayName: username,
      photoURL: result.user.photoURL || '',
      uid: result.user.uid || '',
      emailVerified: result.user.emailVerified || false,
    };

    this.updateUserData(userData);

    this.sendVerificationMail();
  }

  sendVerificationMail() {
    return this.afAuth.currentUser
      .then((user) => user?.sendEmailVerification())
      .then(() => {
        this.router.navigate(['dashboard']);
      });
  }

  async signIn(email: string, password: string) {
    const res = await this.afAuth.signInWithEmailAndPassword(email, password);
    if (!res.user) {
      console.log('Login error');
      return;
    }

    this.router.navigate(['dashboard']);
  }

  async signOut() {
    await this.afAuth.signOut();
    this.router.navigate(['/']);
  }

  private updateUserData({
    uid,
    email,
    displayName,
    photoURL,
    emailVerified,
  }: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${uid}`
    );

    const data: User = {
      uid,
      email,
      displayName,
      photoURL,
      emailVerified,
    };

    userRef.set(data, { merge: true });
  }
}
