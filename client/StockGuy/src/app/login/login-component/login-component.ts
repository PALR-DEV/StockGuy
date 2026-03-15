import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { Button, ButtonDirective } from "primeng/button";


@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css'],
  imports: [InputTextModule, ButtonDirective]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private router: Router) {}

  handleSubmit(emailValue: string, passwordValue: string): void {
    this.error = '';
    const email = emailValue?.trim();
    const password = passwordValue?.trim();

    if (!email || !password) {
      this.error = 'Please fill in all fields';
      return;
    }

    // this.router.navigate(['/dashboard']);
  }

  goToSignup(): void {
    // this.router.navigate(['/signup']);
  }
}
