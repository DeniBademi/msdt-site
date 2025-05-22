import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router} from '@angular/router';
import {BackendService} from '../../_services/backend.service';
import {LocalStorageService} from '../../_services/local-storage.service';

@Component({
  selector: 'app-saved-answers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './saved-answers.component.html',
  styleUrl: './saved-answers.component.css'
})

export class SavedAnswersComponent {
  questions: any[] = [];
  questionnaireId: number = 1; // Default questionnaire ID

  constructor(private router: Router, private backend: BackendService, private storage: LocalStorageService) {
    this.ngOnInit().then(r => {  });
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  downloadAnswersCsv() {
    this.backend.downloadAnswersCsv(this.questionnaireId);
  }

  async ngOnInit() {
    await this.loadQuestionsAndAnswers();
  }

  async loadQuestionsAndAnswers() {
    try {
      const data = await this.backend.getQuestions();
      // console.log('Fetched questions:', data);

      this.questions = await Promise.all(data.questions.map(async (q: any) => {
        const answersData = await this.backend.getAnswers(q.id);
        // console.log(`Answers for question ID ${q.id}:`, answersData);
        return {
          ...q,
          answers: answersData.answers,
          open: false
        };
      }));

      // console.log('Final questions array with answers:', this.questions);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  }

}
