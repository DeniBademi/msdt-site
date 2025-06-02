import { Component } from '@angular/core';
import { VariableDisplayComponent } from "../variable-display/variable-display.component";
import { ProbabilityBarComponent } from "../../components/probability-bar/probability-bar.component";
import { BackendService } from '../../_services/backend.service';
import { CommonModule } from '@angular/common';
import { UploadNetworkFormComponent } from '../../components/upload-network-form/upload-network-form.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEvidenceComponent } from '../../components/add-evidence/add-evidence.component';
import { NetworkListComponent } from '../../components/network-list/network-list.component';
import { ToastrService } from 'ngx-toastr';
import test_table_method_json from '../../../test_folder/table_metod.json'
import {AppRoutes} from '../../app.routes';
import {Router} from '@angular/router';
import { QuestionnaireComponent } from '../questionnaire/questionnaire.component';
import { ResultComponent } from "../../components/result/result.component";
import { TableMethodJsonModel } from '../../_models/TableMethodJson.model';
import { PredictionService } from '../../_services/prediction.service';

interface NetworkMetadata {
  id: string;
  name: string;
  metadata: {
    [key: string]: {
      states: string[];
    };
  };
}


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    AddEvidenceComponent,
    MatDialogModule,
    ResultComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  popupVisible = false;
  metadata: NetworkMetadata | null = null;
  selectedNetwork: any;
  dropdownStates: { [key: string]: boolean } = {};
  dropdownItemsResults: string[] = ['results 1', 'Results 2', 'Results 3'];
  dropdownItemsExplanation: string[] = ['Table method', 'MPE'];
  selectedOptions: { [key: string]: string } = {'Explanation': 'Table method'};
  levelOneVisible: boolean = false;
  levelTwoVisible: boolean = false;
  levelThreeVisible: boolean = false;
  table_method_json: TableMethodJsonModel = test_table_method_json;
  MPE_json: any = {}

  // here I have just used a test json file so far, it is not yet a json from the backend.
  query: string = this.table_method_json.prediction.variable_name;
  query_result_value = this.table_method_json.prediction.predicted_value;
  query_result_probability = this.table_method_json.prediction.probability;
  non_conflicting_evidence = this.table_method_json.supporting_factors;
  conflicting_evidence = this.table_method_json.opposing_factors;
  intermediate_nodes = this.table_method_json.immediate_causes;
  level_three_nodes = this.table_method_json.level3_explanations;



  constructor(
    private router: Router,
    private backend: BackendService,
    private modals: MatDialog,
    private toastr: ToastrService,
    private predictionService: PredictionService
  ) {}

  openPopup() {
    if (this.metadata) {
      this.popupVisible = true;
    } else {
      this.toastr.warning('Please select a network first', 'No Network Selected');
    }
  }

  get entries(){
    return Object.entries(this.MPE_json.MPE)
  }

  closePopup() {
    this.popupVisible = false;
  }

  toggleDropdown(menu: string) {
    Object.keys(this.dropdownStates).forEach((key) => {
      if (key !== menu) {
        this.dropdownStates[key] = false;
      }
    });
    this.dropdownStates[menu] = !this.dropdownStates[menu];
  }

  selectOption(menu: string, option: string) {
    this.selectedOptions[menu] = option;
    this.dropdownStates[menu] = false;
  }

  getMetadata(networkId: string) {
    this.backend.getMetadata(networkId).then((response: NetworkMetadata) => {
      this.metadata = response;
    }).catch((error: any) => {
      this.toastr.error(error.error.error, "Error loading network");
      this.metadata = null;
    });
  }

  clearMetadata() {
    this.metadata = null;
    this.selectedNetwork = null;
  }

  openUploadForm() {
    let dialogRef = this.modals.open(UploadNetworkFormComponent, {
      height: '500px',
      width: '1200px'
    });
  }

  onNetworkSelected(network: any) {
    console.log('Selected network:', network);
    this.selectedNetwork = network;
    this.getMetadata(network.id);
  }

  openNetworkList() {
    let dialogRef = this.modals.open(NetworkListComponent, {
      height: '500px',
      width: '600px'
    });

    dialogRef.componentInstance.networkSelected.subscribe((network: any) => {
      this.onNetworkSelected(network);
      dialogRef.close();
    });
  }

  onEvidenceSubmit(evidence: any) {
    console.log('Evidence submitted:', evidence);
    this.backend.predict(evidence).subscribe({
      next: (response) => {
        this.table_method_json = response;

        console.log('Backend prediction response:', response);
        this.predictionService.setPredictionResult(response);
        this.query = response.prediction.variable_name;
        this.query_result_value = response.prediction.predicted_value;
        this.query_result_probability = response.prediction.probability;
        this.non_conflicting_evidence = response.supporting_factors;
        this.conflicting_evidence = response.opposing_factors;
        this.intermediate_nodes = response.immediate_causes;
        this.level_three_nodes = response.level3_explanations;

      },
      error: (err) => {
        console.error('Prediction failed:', err);
        this.toastr.error('Prediction failed', 'Error');
      }
    });
    this.backend.predict_MPE(evidence).subscribe({
      next: (response) => {
        console.log('Backend prediction response:', response);
        this.MPE_json = response;

      },
      error: (err) => {
        console.error('Prediction failed:', err);
        this.toastr.error('Prediction failed', 'Error');
      }
    });
  }

  openQuestionareAnswersPage() {
    this.router.navigate([AppRoutes.SAVEDANSWERS]);
  }
  openQuestionnaireDialog() {
    const dialogRef = this.modals.open(QuestionnaireComponent, {
      width: '700px',
      maxHeight: '90vh',
      disableClose: true // optional: prevents closing without Submit/Cancel
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Questionnaire dialog was closed');
      // You can add logic here if needed after the popup closes
    });
  }

  isAdmin() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;

    try {
      const user = JSON.parse(userStr);
      return user && user.role === 'admin';
    } catch {
      return false;
    }
  }
}
