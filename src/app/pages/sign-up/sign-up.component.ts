import {Component, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { BackendService } from '../../_services/backend.service';
import { SignUpCredentials } from '../../_models/SignUpCredentials';
import { LocalStorageService } from '../../_services/local-storage.service';
import {AppRoutes} from '../../app.routes';

@Component({
  selector: 'app-sign-up',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class SignUpComponent {

  signUpForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('' , [Validators.required]),
    passwordRepeat: new FormControl('', [Validators.required]),
    isAdmin: new FormControl(false)
  });

  constructor(private router: Router, private backend: BackendService, private storage: LocalStorageService) { }

  onSubmit() {
    if (!this.signUpForm.valid) {
      alert('Please fill out all fields');
      return;
    }
    if (this.signUpForm.value.password !== this.signUpForm.value.passwordRepeat) {
      alert('Passwords do not match');
      return;
    }

    let creds = new SignUpCredentials(this.signUpForm.value.username!, this.signUpForm.value.password!);


    this.backend.signUp(creds).then(response => {
      this.storage.setUser(response);
      alert("Sign up successful");
      this.router.navigate(['/']);
    }).catch(err => {
      alert("Cannot connect to server");
    });
  }

  handleSignIn() {
    this.router.navigate([AppRoutes.LOGIN]);
  }
}
