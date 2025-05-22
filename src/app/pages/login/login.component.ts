import {Component, ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { BackendService } from '../../_services/backend.service';
import { LocalStorageService } from '../../_services/local-storage.service';
import { LoginCredentials } from '../../_models/LoginCredentials';
import {AppRoutes} from '../../app.routes';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  encapsulation: ViewEncapsulation.None
})

export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private router: Router,
    private backend: BackendService,
    private storage: LocalStorageService,
    private toastr: ToastrService
    ) {}

  handleLogin() {
    if (!this.loginForm.valid) {
      alert('Please fill out all fields');
      return;
    }

    let creds = new LoginCredentials(this.loginForm.value.username!, this.loginForm.value.password!);

    this.backend.login(creds).then(response => {
      console.log(response);
      this.toastr.success("Login successful");
      this.storage.setUser(response);
      this.router.navigate([AppRoutes.HOME]);
    }).catch(err => {
      this.toastr.error("Login failed");
    });
  }
  handleSignUp() {
    this.router.navigate([AppRoutes.SIGNUP]);
  }
}
