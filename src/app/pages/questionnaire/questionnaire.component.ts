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
  form!: FormGroup ;
  questions: any[] = [];

  constructor(private fb: FormBuilder, 
    private backend: BackendService,
    private router: Router,
    public dialogRef: MatDialogRef<QuestionnaireComponent> ) {}

  async ngOnInit() {
    try {
      const data = await this.backend.getQuestions();
      this.questions = data.questions;

      const group: any = {};
      this.questions.forEach(q => {
        group[q.id] = [''];
      });
      this.form = this.fb.group(group);

    } catch (error) {
      console.error('Failed to load questions:', error);
    }
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
  
    const answersArray = Object.entries(rawAnswers).map(([questionId, answerText]) => ({
      question_id: Number(questionId),
      answer_text: String(answerText)  
    }));
  
    try {
      const response = await this.backend.submitAnswers(userId, answersArray);
      console.log('Backend response:', response);
      alert('Thanks for your feedback!');
      this.dialogRef.close();
      this.router.navigate(['/saved-answers']);
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('Submission failed. Please try again.');
    }
  }
  
  goBack() {
    this.dialogRef.close();
}
}
