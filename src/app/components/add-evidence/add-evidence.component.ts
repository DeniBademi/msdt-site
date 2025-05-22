import { CommonModule } from '@angular/common';
import { Component, Input, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BackendService } from '../../_services/backend.service';

interface VariableMetadata {
  states: string[];
}

interface NetworkMetadata {
  network_id: string;
  metadata: {
    [key: string]: VariableMetadata;
  };
}

interface EvidenceItem {
  variable: string;
  value: string;
}

interface EvidenceSubmission {
  query: string;
  evidence_list: EvidenceItem[];
}

@Component({
  selector: 'app-add-evidence',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-evidence.component.html',
  styleUrl: './add-evidence.component.css'
})
export class AddEvidenceComponent implements OnInit, OnDestroy {
  private metadataSubject = new BehaviorSubject<NetworkMetadata | null>(null);
  private subscription: Subscription = new Subscription();
  isLoading = false;

  @Input() set metadata(value: NetworkMetadata | null) {
    this.metadataSubject.next(value);
  }
  @Output() close: EventEmitter<void> = new EventEmitter();
  @Output() submitEvidence: EventEmitter<EvidenceSubmission> = new EventEmitter();

  evidenceForm: FormGroup;
  formValues: { [key: string]: string } = {};
  currentMetadata: NetworkMetadata | null = null;
  selectedQuery: string | null = null;

  constructor(
    private fb: FormBuilder,
    private backendService: BackendService
  ) {
    this.evidenceForm = this.fb.group({});
  }

  ngOnInit() {
    this.subscription = this.metadataSubject.subscribe(metadata => {
      this.currentMetadata = metadata;
      if (metadata && metadata.metadata) {
        this.buildForm(metadata);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private buildForm(metadata: NetworkMetadata) {
    const formControls: { [key: string]: any } = {};
    Object.keys(metadata.metadata).forEach(variable => {
      formControls[variable] = ['', {disabled: false}];
    });
    this.evidenceForm = this.fb.group(formControls);
    this.selectedQuery = null;
  }

  setQueryVariable(variable: string) {
    if (this.selectedQuery === variable) {
      this.selectedQuery = null;
      this.evidenceForm.get(variable)?.disable();

    } else {
      this.selectedQuery = variable;
      this.evidenceForm.get(variable)?.enable();
      this.evidenceForm.get(variable)?.setValue('');
    }

  }

  isQueryVariable(variable: string): boolean {
    return this.selectedQuery === variable;
  }

  async onSubmit() {
    if (this.evidenceForm.valid && this.selectedQuery) {
      this.isLoading = true;
      this.disableAllVariables();
      const evidence_list: EvidenceItem[] = [];

      Object.entries(this.evidenceForm.value).forEach(([variable, value]) => {
        if (value && variable !== this.selectedQuery) {
          evidence_list.push({
            variable,
            value: value as string
          });
        }
      });

      const submission: EvidenceSubmission = {
        query: this.selectedQuery,
        evidence_list
      };

      try {

        let dummy_submission =  {
              "query": "LNM",
              "evidence_list": [
                  {
                      "variable": "CA125",
                      "value": "1"
                  },
                  {
                      "variable": "PrimaryTumor",
                      "value": "2"
                  },
                  {
                      "variable": "L1CAM",
                      "value": "1"
                  }
              ]
          }

        await this.backendService.predict(dummy_submission);
        this.submitEvidence.emit(dummy_submission);
      } catch (error) {
        console.error('Error submitting prediction:', error);
        // You might want to show an error message to the user here
      } finally {
        this.isLoading = false;
        this.enableAllVariables();
      }
    }
  }
  disableAllVariables() {
    Object.keys(this.evidenceForm.value).forEach(variable => {
      this.evidenceForm.get(variable)?.disable();
    });
  }
  enableAllVariables() {
    Object.keys(this.evidenceForm.value).forEach(variable => {
      this.evidenceForm.get(variable)?.enable();
    });
  }
}