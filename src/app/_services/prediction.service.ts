import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PredictionResult {
  prediction: any;
  explanation: any;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})

/**
 * Service to store, retrieve, and manage prediction results and explanations
 * It uses a BehaviorSubject to allow reactive updates in the application
 */
export class PredictionService {
  private predictionResultSubject = new BehaviorSubject<PredictionResult | null>(null);
  public predictionResult$ = this.predictionResultSubject.asObservable();

  constructor(private toastr: ToastrService) { }

  setPredictionResult(result: any): void {

    if (!result.prediction.variable_name) {
      this.toastr.error("Failed to get prediction result");
      return;
    }

    // if(result.supporting_factors.length === 0) {
    //   this.toastr.error("Failed to get explanation results");
    //   return;
    // }

    let explanation: { [key: string]: any } = {};
    explanation['supporting_factors'] = result.supporting_factors;
    explanation['opposing_factors'] = result.opposing_factors;
    explanation['immediate_causes'] = result.immediate_causes;
    explanation['level3_explanation'] = result.level3_explanation;

    const predictionResult: PredictionResult = {
      prediction: result.prediction,
      explanation: explanation,
      timestamp: new Date()
    };
    this.predictionResultSubject.next(predictionResult);
  }

  /**
   * Retrieves the current prediction result stored in the service
   * @returns The latest `PredictionResult`, or `null` if none is set
   */
  getPredictionResult(): PredictionResult | null {
    return this.predictionResultSubject.value;
  }

  /**
   * Clears the current prediction result
   */
  clearPredictionResult(): void {
    this.predictionResultSubject.next(null);
  }
}