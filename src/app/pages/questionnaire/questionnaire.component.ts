import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import{ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BackendService } from '../../_services/backend.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

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

  constructor(
    private fb: FormBuilder,
    private backend: BackendService,
    private router: Router,
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
        group[question.id] = [''];
      });
      this.form = this.fb.group(group);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  }

  setRating(questionId: string, rating: number) {
    this.ratings[questionId] = rating;
    this.form.get(questionId)?.setValue(rating.toString());
  }

  getStarClass(questionId: string, star: number): string {
    const rating = this.ratings[questionId] || 0;
    return rating >= star ? 'text-yellow-400' : 'text-gray-300';
  }

  goBack() {
    this.dialogRef.close();
  }

  async onSubmit(ev: Event) {
    ev.preventDefault();

    if (this.form.invalid) {
      alert('Please fill out all fields.');
      return;
    }

    const userId = Number(1);
    // const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      alert('User ID not found. Please log in first.');
      return;
    }

    const rawAnswers = this.form.value;

    const answersArray = Object.entries(rawAnswers).map(([questionId, answerText]) => {
      // For rating questions, use the rating value from our ratings object
      const question = this.questions.find(q => q.id.toString() === questionId);
      const value = question?.question_type === 'rating'
        ? this.ratings[questionId]?.toString() || '0'
        : String(answerText);

      return {
        question_id: Number(questionId),
        answer_text: value
      };
    });

    try {
      const response = await this.backend.submitAnswers(answersArray);
      console.log('Backend response:', response);
      alert('Thanks for your feedback!');
      this.dialogRef.close();
      this.router.navigate(['/saved-answers']);
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('Submission failed. Please try again.');
    }
  }
}
