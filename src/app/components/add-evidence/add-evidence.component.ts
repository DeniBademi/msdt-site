import { CommonModule } from '@angular/common';
import { Component, Input, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BackendService } from '../../_services/backend.service';

/**
 * Interface representing the metadata structure for a Bayesian network.
 */
interface NetworkMetadata {
  id: string;
  name: string;
  metadata: {
    [key: string]: {
      states: string[];
    };
  };
}

/**
 * Interface for the structure of a submission object containing evidence and the query variable.
 */
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
/**
 * A component for users to input evidence and specify a query variable for probabilistic inference.
 */
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

  /**
   * Initializes the component and subscribes to metadata updates to build the form.
   */
  ngOnInit() {
    this.subscription = this.metadataSubject.subscribe(metadata => {
      this.currentMetadata = metadata;
      if (metadata && metadata.metadata) {
        this.buildForm(metadata);
      }
    });
  }

  /**
   * Cleans up the subscription to prevent memory leaks.
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Builds the dynamic form controls based on the variables in the metadata.
   * @param metadata The network metadata containing variable names and states.
   */
  private buildForm(metadata: NetworkMetadata) {
    const formControls: { [key: string]: any } = {};
    Object.keys(metadata.metadata).forEach(variable => {
      formControls[variable] = ['', {disabled: false}];
    });
    this.evidenceForm = this.fb.group(formControls);
    this.selectedQuery = null;
  }

  /**
   * Sets or unsets a variable as the query. Only one query variable can be selected at a time.
   * @param variable The name of the variable to toggle as the query.
   */
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

  /**
   * Checks whether the given variable is currently selected as the query variable.
   * @param variable The name of the variable to check.
   * @returns True if the variable is the current query, false otherwise.
   */
  isQueryVariable(variable: string): boolean {
    return this.selectedQuery === variable;
  }

  /**
   * Handles the form submission: collects evidence, emits submission, and invokes prediction.
   */
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
      } finally {
        this.isLoading = false;
        this.enableAllVariables();
      }
    }
  }

  /**
   * Disables all form controls
   */
  disableAllVariables() {
    Object.keys(this.evidenceForm.value).forEach(variable => {
      this.evidenceForm.get(variable)?.disable();
    });
  }

  /**
   * Enables all form controls
   */
  enableAllVariables() {
    Object.keys(this.evidenceForm.value).forEach(variable => {
      this.evidenceForm.get(variable)?.enable();
    });
  }

  /**
   * Gets the current evidence that has been input so far
   * @returns An object containing the current evidence values
   */
  getCurrentEvidence(): { [key: string]: string } {
    const evidence: { [key: string]: string } = {};
    Object.entries(this.evidenceForm.value).forEach(([variable, value]) => {
      if (value && variable !== this.selectedQuery) {
        evidence[variable] = value as string;
      }
    });
    return evidence;
  }

  /**
   * Gets the number of evidence items currently input
   * @returns The count of evidence items
   */
  getEvidenceCount(): number {
    return Object.keys(this.getCurrentEvidence()).length;
  }

  /**
   * Clears all evidence inputs while preserving the query variable selection
   */
  clearEvidence() {
    Object.keys(this.evidenceForm.value).forEach(variable => {
      if (variable !== this.selectedQuery) {
        this.evidenceForm.get(variable)?.setValue('');
      }
    });
  }
}
