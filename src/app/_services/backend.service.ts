import { Injectable } from '@angular/core';
import { LoginCredentials } from '../_models/LoginCredentials';
import { SignUpCredentials } from '../_models/SignUpCredentials';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../_models/User';
import { firstValueFrom } from 'rxjs';
import { PredictionService } from './prediction.service';
import { TableMethodJsonModel } from '../_models/TableMethodJson.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(
    private http: HttpClient,
    private predictionService: PredictionService
  ) { }

  backendURL = 'http://127.0.0.1:8000/api';

  public login(credentials: LoginCredentials): Promise<User> {

    return new Promise((resolve, reject) => {
      this.http.post<User>(this.backendURL + '/login/', credentials)
      .subscribe({
        next: (user: User) => {
          resolve(user);
        },
        error: (err) => {
          reject(err);
        }});
      });
  }

  public signUp(credentials: SignUpCredentials): Promise<User> {
    return new Promise((resolve, reject) => {
      this.http.post<User>(this.backendURL + '/signup/', credentials)
      .subscribe({
        next: (user: User) => {
          resolve(user);
        },
        error: (err) => {
          reject(err);
        }});
      });
  }

  public getMetadata(network_id: string): Promise<any> {
    let params = new HttpParams();
    params.append('network_id', network_id);

    return new Promise((resolve, reject) => {
      this.http.get<User>(this.backendURL + '/getmetadata/'+network_id)
      .subscribe({
        next: (user: User) => {
          resolve(user);
        },
        error: (err) => {
          reject(err);
        }});
      });
  }

  public uploadModel(formData: FormData): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post<any>(this.backendURL + '/upload_model/', formData)
      .subscribe({
        next: (response) => {
          resolve(response);
        },
        error: (err) => {
          reject(err);
        }});
    });
  }

  public getNetworks(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(this.backendURL + '/networks/')
      .subscribe({
        next: (response) => {
          resolve(response);
        },
        error: (err) => {
          reject(err);
        }});
    });
  }

  public getQuestions(): Promise<any> {
    const params = new HttpParams().set('questionnaire_id', '1');
    return firstValueFrom(this.http.get<any>(this.backendURL + '/get_questions/', { params }));
  }

  public getAnswers(questionId: number): Promise<any> {
    const params = new HttpParams().set('question_id', questionId.toString());
    return firstValueFrom(this.http.get<any>(this.backendURL + '/get_answers/', { params }));
  }

  public downloadAnswersCsv(questionnaireId: number): void {
    const params = new HttpParams().set('questionnaire_id', questionnaireId.toString());
    window.open(this.backendURL + '/download_answers_csv/?' + params.toString(), '_blank');
  }

  public submitAnswers(userId: number, answers: { question_id: number, answer_text: string }[]) {
    return firstValueFrom(
      this.http.post<any>(this.backendURL + '/submit_answers/', {
        user_id: userId,
        answers: answers
      })
    );
  }

  public predict(evidence: any): Observable<TableMethodJsonModel>{
    return this.http.post<TableMethodJsonModel>('http://127.0.0.1:8000/api/predict', evidence);
  }

}
