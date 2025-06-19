import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BackendService } from '../../_services/backend.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private backendService: BackendService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.toastr.error('New passwords do not match');
      return;
    }

    this.backendService.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: () => {
        this.toastr.success('Password changed successfully');
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (error) => {
        this.toastr.error(error.error.message || 'Failed to change password');
      }
    });
  }

  logout() {
    this.backendService.logout();
    this.router.navigate(['/login']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
}