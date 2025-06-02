import { CommonModule } from '@angular/common';
import { Component, Input, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BackendService } from '../../_services/backend.service';


interface NetworkMetadata {
  id: string;
  name: string;
  metadata: {
    [key: string]: {
      states: string[];
    };
  };
}

interface EvidenceSubmission {
  query: string;
  evidence: { [key: string]: string };
  network: string;
}

@Component({
  selector: 'app-add-evidence',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-evidence.component.html',
  standalone: true,
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
      const evidence_dict: { [key: string]: string } = {};

      Object.entries(this.evidenceForm.value).forEach(([variable, value]) => {
        if (value && variable !== this.selectedQuery) {
          evidence_dict[variable] = value as string;
        }
      });

      const submission: EvidenceSubmission = {
        query: this.selectedQuery,
        evidence: evidence_dict,
        network: this.currentMetadata!.id
      };

      try {
        let dummy_submission = {
          "query": "LNM",
          "evidence_dict": {
            "CA125": "1",
            "PrimaryTumor": "2",
            "L1CAM": "1"
          }
        }

        await this.backendService.predict(submission);
        this.submitEvidence.emit(submission);
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
