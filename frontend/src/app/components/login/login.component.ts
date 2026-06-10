import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({ selector: 'app-login', templateUrl: './login.component.html', styleUrls: ['./login.component.scss'] })
export class LoginComponent implements OnInit {
  mode: 'login' | 'register' = 'login';
  form!: FormGroup;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.auth.isLoggedIn()) this.router.navigate(['/dashboard']);
    this.form = this.fb.group({ name: [''], email: ['', [Validators.required, Validators.email]], password: ['', [Validators.required, Validators.minLength(6)]] });
  }

  toggleMode() { this.mode = this.mode === 'login' ? 'register' : 'login'; this.error = ''; }

  submit() {
    if (this.form.invalid) return;
    this.loading = true; this.error = '';
    const { name, email, password } = this.form.value;
    const obs = this.mode === 'login' ? this.auth.login(email, password) : this.auth.register(name, email, password);
    obs.subscribe({ next: () => this.router.navigate(['/dashboard']), error: e => { this.error = e.error?.detail || 'Something went wrong'; this.loading = false; } });
  }

  fillDemo() { this.form.patchValue({ email: 'mithilesh@demo.com', password: 'demo123' }); }
}
