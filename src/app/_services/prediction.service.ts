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
export class PredictionService {
  private predictionResultSubject = new BehaviorSubject<PredictionResult | null>(null);
  public predictionResult$ = this.predictionResultSubject.asObservable();

  constructor(private toastr: ToastrService) { }

  setPredictionResult(result: any): void {

    if (!result.prediction.variable_name) {
      this.toastr.error("Failed to get prediction result");
      return;
    }

    if(result.supporting_factors.length === 0) {
      this.toastr.error("Failed to get explanation results");
      return;
    }

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

  getPredictionResult(): PredictionResult | null {
    return this.predictionResultSubject.value;
  }

  clearPredictionResult(): void {
    this.predictionResultSubject.next(null);
  }
}