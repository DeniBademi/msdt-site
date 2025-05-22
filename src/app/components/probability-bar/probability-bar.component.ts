import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-probability-bar',
  imports: [CommonModule],
  templateUrl: './probability-bar.component.html',
  styleUrl: './probability-bar.component.css'
})
export class ProbabilityBarComponent {

  @Input() probability: number = 0;
  @Input() variable: string = '';
  @Input() predictedValue: string = '';

  getProgressColor(): string {
    if (this.probability < 10) return 'bg-red-600';
    if (this.probability < 20) return 'bg-red-500';
    if (this.probability < 30) return 'bg-orange-600';
    if (this.probability < 40) return 'bg-orange-500';
    if (this.probability < 50) return 'bg-amber-500';
    if (this.probability < 60) return 'bg-amber-500';
    if (this.probability < 70) return 'bg-yellow-500';
    if (this.probability < 80) return 'bg-yellow-400';
    if (this.probability < 90) return 'bg-lime-400';
    if (this.probability < 100) return 'bg-green-500';
    return 'bg-green-600';

  }

}
