import { Injectable } from '@angular/core';
import { LoginCredentials } from '../_models/LoginCredentials';
import { SignUpCredentials } from '../_models/SignUpCredentials';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../_models/User';
import { firstValueFrom } from 'rxjs';
import { PredictionService } from './prediction.service';
import { TableMethodJsonModel } from '../_models/TableMethodJson.model';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
@Injectable({
  providedIn: 'root'
})

/**
 * Service to communicate with the backend API.
 * Handles user authentication, data retrieval, predictions, and model management
 */
export class BackendService {

  constructor(
    private http: HttpClient,
    private predictionService: PredictionService,
    private localStorage: LocalStorageService
  ) { }

  backendURL = 'https://msdt-backend-production.up.railway.app/api';

  /**
   * Log in a user by sending login credentials to backend
   * Store the returned user information and token locally on success
   * @param credentials LoginCredentials object containing username and password.
   * @returns A Promise resolving to a User object on success or rejecting with an error.
   */
  public login(credentials: LoginCredentials): Promise<User> {

    return new Promise((resolve, reject) => {
      this.http.post<User>(this.backendURL + '/login/', credentials)
      .subscribe({
        next: (user: User) => {
          resolve(user);
          this.localStorage.setUser(user);
          console.log(this.localStorage.getUser());
        },
        error: (err) => {
          reject(err);
        }});
      });
  }

  /**
   * signs up a new user by sending signup credentials to the backend.
   * @param credentials SignUpCredentials object containing username, password, optional role, and admin code.
   * @returns A Promise resolving to a User object on success or rejecting with an error.
   */
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

  /**
   * gets metadata for a given network from the backend
   * @param network_id The ID of the network to fetch metadata for
   * @returns A Promise resolving to the metadata or rejecting with an error
   */
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

   /**
   * Uploads a model file to the backend.
   * @param formData FormData object containing the model file data.
   * @returns A Promise resolving to any response from the backend or rejecting with an error.
   */
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

   /**
   * gets a list of available networks from the backend.
   * @returns A Promise resolving to any response containing networks or rejecting with an error
   */
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

  /**
   * gets questions for the questionnaire
   * @returns A Promise resolving to any response containing questions.
   */
  public getQuestions(): Promise<any> {
    const params = new HttpParams().set('questionnaire_id', '1');
    return firstValueFrom(this.http.get<any>(this.backendURL + '/get_questions/', { params }));
  }

  /**
   * gets answers for a given question
   * @param questionId The ID of the question to get answers for
   * @returns A Promise resolving to any response containing answers
   */
  public getAnswers(questionId: number): Promise<any> {
    const params = new HttpParams().set('question_id', questionId.toString());
    return firstValueFrom(this.http.get<any>(this.backendURL + '/get_answers/', { params }));
  }

  /**
   * Downloads answers as a CSV file for a specified questionnaire.
   * Opens a new browser tab/window to initiate the download.
   * @param questionnaireId The ID of the questionnaire to download answers for.
   */
  public downloadAnswersCsv(questionnaireId: number): void {

    const token = this.localStorage.getToken();

    const params = new HttpParams().set('questionnaire_id', questionnaireId.toString()).set('token', token.toString()!);

    window.open(this.backendURL + '/download_answers_csv/?' + params.toString(), '_blank');
  }

  /**
   * Submits answers for questions to the backend
   * @param answers Array of objects each containing question_id and answer_text.
   * @returns A Promise resolving to any response from the backend.
   */
  public submitAnswers(answers: { question_id: number, answer_text: string }[]) {
    return firstValueFrom(
      this.http.post<any>(this.backendURL + '/submit_answers/', {
        answers: answers
      })
    );
  }

  /**
   * Sends evidence data to the backend for prediction.
   * @param evidence Evidence object to base the prediction on.
   * @returns An Observable emitting a TableMethodJsonModel prediction response.
   */
  public predict(evidence: any): Observable<TableMethodJsonModel>{
    return this.http.post<TableMethodJsonModel>(this.backendURL + '/predict/', evidence);
  }

  /**
   * Sends evidence data to the backend for Most Probable Explanation (MPE) prediction.
   * @param evidence Evidence object to base the MPE prediction on.
   * @returns An Observable emitting any response from the backend.
   */
  public predict_MPE(evidence: any): Observable<any>{
    return this.http.post<any>(this.backendURL + '/predict_MPE/', evidence);
  }

  public changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post<any>(this.backendURL + '/change-password/', {
      current_password: currentPassword,
      new_password: newPassword
    });
  }

  public logout(): void {
    this.localStorage.removeAuthData();
  }

}
