import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({ selector: 'app-task-modal', templateUrl: './task-modal.component.html', styleUrls: ['./task-modal.component.scss'] })
export class TaskModalComponent implements OnInit, OnChanges {
  @Input() task: Task | null = null;
  @Input() visible = false;
  @Output() save = new EventEmitter<Partial<Task>>();
  @Output() close = new EventEmitter<void>();

  form!: FormGroup;
  tagInput = '';
  tags: string[] = [];
  categories = ['Frontend', 'Backend', 'Design', 'DevOps', 'Testing', 'Research', 'Other'];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      status: ['todo', Validators.required],
      priority: ['medium', Validators.required],
      category: ['Frontend', Validators.required],
      due_date: ['', Validators.required]
    });
    if (this.task) { this.form.patchValue(this.task); this.tags = [...(this.task.tags || [])]; }
  }

  ngOnChanges() {
    if (!this.form) return;
    if (this.task) { this.form.patchValue(this.task); this.tags = [...(this.task.tags || [])]; }
    else { this.form.reset({ status: 'todo', priority: 'medium', category: 'Frontend' }); this.tags = []; }
  }

  addTag() { const t = this.tagInput.trim(); if (t && !this.tags.includes(t)) this.tags.push(t); this.tagInput = ''; }
  removeTag(tag: string) { this.tags = this.tags.filter(t => t !== tag); }
  onTagKey(e: KeyboardEvent) { if (e.key === 'Enter') { e.preventDefault(); this.addTag(); } }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.save.emit({ ...this.form.value, tags: this.tags });
  }

  onBackdrop(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) this.close.emit();
  }
}
