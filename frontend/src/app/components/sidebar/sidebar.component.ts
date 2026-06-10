import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/task.model';

@Component({ selector: 'app-sidebar', templateUrl: './sidebar.component.html', styleUrls: ['./sidebar.component.scss'] })
export class SidebarComponent {
  @Input() activeView = 'board';
  @Input() user: User | null = null;
  @Output() viewChange = new EventEmitter<string>();
  constructor(private auth: AuthService, private router: Router) {}
  navigate(v: string) { this.viewChange.emit(v); }
  logout() { this.auth.logout(); this.router.navigate(['/login']); }
}
