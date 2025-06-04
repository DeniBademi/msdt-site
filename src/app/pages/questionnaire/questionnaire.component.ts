import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import{ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BackendService } from '../../_services/backend.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatDialogModule],
  templateUrl: './questionnaire.component.html',
  styleUrl: './questionnaire.component.css'
})
export class QuestionnaireComponent implements OnInit {
  form!: FormGroup;
  questions: any[] = [];
  ratings: { [key: string]: number } = {};
  isFormValid: boolean = false;

  constructor(
    private fb: FormBuilder,
    private backend: BackendService,
    private router: Router,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<QuestionnaireComponent>
  ) {}

  ngOnInit() {
    this.loadQuestions();
  }

  async loadQuestions() {
    try {
      const response = await this.backend.getQuestions();
      this.questions = response.questions;

      // Initialize form controls
      const group: { [key: string]: any } = {};
      this.questions.forEach(question => {
        // Add required validator if the question is required
        const validators = question.required ? [Validators.required] : [];
        // Ensure we use string IDs for form controls
        const questionId = question.id.toString();
        group[questionId] = ['', validators];
      });
      this.form = this.fb.group(group);

      // Subscribe to form value changes to update validity
      this.form.valueChanges.subscribe(() => {
        this.updateFormValidity();
      });
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  }

  updateFormValidity() {
    // Check if all required questions have non-empty answers
    const isValid = this.questions.every(question => {
      if (!question.required) return true;

      const questionId = question.id.toString();
      const control = this.form.get(questionId);
      if (!control) return false;

      const value = control.value;
      if (question.question_type === 'rating') {
        return this.ratings[questionId] !== undefined;
      }
      return value && value.trim() !== '';
    });

    this.isFormValid = isValid;
  }

  setRating(questionId: number, rating: number) {
    const questionIdStr = questionId.toString();
    this.ratings[questionIdStr] = rating;
    this.form.get(questionIdStr)?.setValue(rating.toString());
    this.updateFormValidity();
  }

  getStarClass(questionId: number, star: number): string {
    const questionIdStr = questionId.toString();
    const rating = this.ratings[questionIdStr] || 0;
    return rating >= star ? 'text-yellow-400' : 'text-gray-300';
  }

  goBack() {
    this.dialogRef.close();
  }

  async onSubmit(ev: Event) {
    ev.preventDefault();

    if (!this.isFormValid) {
      this.toastr.error('Please fill out all required fields.');
      return;
    }

    const userId = Number(1);
    // const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      this.toastr.error('User ID not found. Please log in first.');
      return;
    }

    const rawAnswers = this.form.value;

    const answersArray = Object.entries(rawAnswers).map(([questionId, answerText]) => {
      // For rating questions, use the rating value from our ratings object
      const question = this.questions.find(q => q.id.toString() === questionId);
      const value = question?.question_type === 'rating'
        ? this.ratings[questionId]?.toString() || ''
        : String(answerText);

      return {
        question_id: Number(questionId),
        answer_text: value
      };
    });

    try {
      const response = await this.backend.submitAnswers(answersArray);
      console.log('Backend response:', response);
      this.toastr.success('Thanks for your feedback!');
      this.dialogRef.close();
      // this.router.navigate(['/saved-answers']);
    } catch (error) {
      console.error('Error submitting answers:', error);
      this.toastr.error('Submission failed. Please try again.');
    }
  }
}
