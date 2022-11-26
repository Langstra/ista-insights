import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { dataStore } from '../dashboard/data.store';
import { getCurrentUser } from './auth.store';
import { LoginService } from './login.service';

@Component({
  selector: 'ista-insights-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  protected form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    disclaimer: [false, Validators.requiredTrue],
  });

  protected isLoading = false;
  protected loginError = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {}

  protected login(): void {
    const previousLogin = getCurrentUser();
    const value = this.form.value;
    if (!value.username || !value.password || !value.disclaimer) {
      return;
    }
    this.loginError = false;
    this.isLoading = true;
    this.loginService.login(value.username, value.password).subscribe({
      next: () => {
        this.isLoading = false;
        if (previousLogin !== getCurrentUser()) {
          dataStore.reset();
        }
        this.router.navigateByUrl('/dashboard');
      },
      error: () => {
        this.isLoading = false;
        this.loginError = true;
        console.log('Error logging in');
      },
    });
  }
}
