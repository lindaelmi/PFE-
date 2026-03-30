import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  isLoading = true;
  errorMessage = '';

  // Search & filter
  searchTerm = '';
  filterRole = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  // Role editing
  editingUser: any = null;
  newRole: string = '';

  // Delete modal
  showDeleteModal = false;
  userToDelete: any = null;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.apiService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Ошибка загрузки пользователей', err);
        this.errorMessage = 'Не удалось загрузить список пользователей. Проверьте подключение к серверу.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.users];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(u =>
        u.id.toString().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        (u.firstName && u.firstName.toLowerCase().includes(term)) ||
        (u.lastName && u.lastName.toLowerCase().includes(term))
      );
    }

    if (this.filterRole) {
      filtered = filtered.filter(u => u.role === this.filterRole);
    }

    this.filteredUsers = filtered;
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    this.currentPage = 1;
  }

  get paginatedUsers(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredUsers.slice(start, end);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  get adminCount(): number {
    return this.users.filter(u => u.role === 'admin').length;
  }

  get userCount(): number {
    return this.users.filter(u => u.role === 'user').length;
  }

  startEditRole(user: any): void {
    this.editingUser = user;
    this.newRole = user.role;
  }

  saveRole(): void {
    if (this.editingUser && this.newRole) {
      // Actual API call (uncomment when endpoint is ready)
      // this.apiService.updateUserRole(this.editingUser.id, { role: this.newRole }).subscribe({
      //   next: () => {
      //     this.editingUser.role = this.newRole;
      //     this.editingUser = null;
      //     this.newRole = '';
      //     this.cdr.detectChanges();
      //     alert('Роль обновлена');
      //   },
      //   error: (err) => {
      //     console.error('Ошибка обновления роли', err);
      //     alert('Ошибка при обновлении роли');
      //   }
      // });

      // Simulation (temporary)
      this.editingUser.role = this.newRole;
      this.editingUser = null;
      this.newRole = '';
      alert('Роль обновлена (симуляция)');
      this.cdr.detectChanges();
    }
  }

  cancelEdit(): void {
    this.editingUser = null;
    this.newRole = '';
  }

  confirmDelete(user: any): void {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.userToDelete = null;
  }

  deleteUserConfirmed(): void {
    if (!this.userToDelete) return;
    this.apiService.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== this.userToDelete.id);
        this.applyFilters();
        this.closeDeleteModal();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Ошибка удаления', err);
        alert('Произошла ошибка при удалении пользователя.');
        this.closeDeleteModal();
      }
    });
  }
}