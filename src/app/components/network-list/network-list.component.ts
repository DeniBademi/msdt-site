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

/**
 * Component for displaying a list of Bayesian networks and allowing the user to select one.
 */
export class NetworkListComponent implements OnInit {
  networks: Network[] = [];
  loading = true;
  error: string | null = null;

  @Output() networkSelected = new EventEmitter<Network>();

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.loadNetworks();
  }

  /**
   * gets the list of networks from the backend service.
   * Sets `networks` on success, or updates `error` on failure.
   */
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

  /**
   * Emits the selected network when a user clicks one from the list.
   * @param network The network selected by the user.
   */
  selectNetwork(network: Network): void {
    this.networkSelected.emit(network);
  }
}
