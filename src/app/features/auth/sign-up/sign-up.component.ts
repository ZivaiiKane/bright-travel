import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signupForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
  });

  constructor(public auth: AuthService) {}

  ngOnInit(): void {}

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get username() {
    return this.signupForm.get('username');
  }

  submit() {
    if (!this.signupForm.valid) {
      return;
    }

    const { email, password, username } = this.signupForm.value;
    this.auth.signUpWithEmail(email, password, username);
  }
}
