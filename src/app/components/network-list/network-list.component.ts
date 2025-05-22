import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackendService } from '../../_services/backend.service';

interface Network {
  id: number;
  name: string;
}

@Component({
  selector: 'app-network-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './network-list.component.html',
  styleUrl: './network-list.component.css'
})
export class NetworkListComponent implements OnInit {
  networks: Network[] = [];
  loading = true;
  error: string | null = null;

  @Output() networkSelected = new EventEmitter<Network>();

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.loadNetworks();
  }

  loadNetworks(): void {
    this.loading = true;
    this.error = null;

    this.backendService.getNetworks()
      .then(response => {
        this.networks = response.networks;
        this.loading = false;
      })
      .catch(error => {
        console.error('Error loading networks:', error);
        this.error = 'Failed to load networks. Please try again later.';
        this.loading = false;
      });
  }

  selectNetwork(network: Network): void {
    this.networkSelected.emit(network);
  }
}
