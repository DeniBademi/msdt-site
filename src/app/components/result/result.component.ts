import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PredictionService } from '../../_services/prediction.service';
import { ProbabilityBarComponent } from "../probability-bar/probability-bar.component";
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
  imports: [ProbabilityBarComponent, CommonModule]
})
export class ResultComponent implements OnInit {

  variable: any;
  predictedValue: any;
  probability: any;

  constructor(private predictionService: PredictionService, private toastr: ToastrService) {

        // To subscribe to prediction result changes - this is how you get the update after PredictionService is updated
        this.predictionService.predictionResult$.subscribe(result => {
          // Handle the new prediction result
          if (result?.prediction.variable_name) {
            this.variable = result?.prediction.variable_name;
            this.predictedValue = result?.prediction.predicted_value;
            this.probability = (100 * result?.prediction.probability).toFixed(2);
          } else {
            this.variable = null;
            this.predictedValue = null;
            this.probability = null;
          }
    });
   }

  ngOnInit() {
  }

}
