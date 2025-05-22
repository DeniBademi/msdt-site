import { Component } from '@angular/core';
import * as data from './example_data.json';
import {NgForOf} from '@angular/common';
import { ProbabilityBarComponent } from '../../components/probability-bar/probability-bar.component';

// @ts-ignore
@Component({
  selector: 'app-variable-display',
  imports: [
    NgForOf,
    ProbabilityBarComponent
  ],
  templateUrl: './variable-display.component.html',
  styleUrl: './variable-display.component.css'
})
export class VariableDisplayComponent {
  variables: any = (data as any).default.variables;
  evidence: any = (data as any).default.evidence;
  queries: any = (data as any).default.queries;
  explanation: any = (data as any).default.explanation;

}
