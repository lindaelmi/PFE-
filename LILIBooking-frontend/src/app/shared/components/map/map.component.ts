// src/app/shared/components/map/map.component.ts
import { Component, AfterViewInit, Input, OnDestroy } from '@angular/core';
import * as L from 'leaflet';

// Fix pour les icônes Leaflet (nécessaire avec Angular)
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  standalone: true,
  template: `<div id="map" style="height: 400px; width: 100%; border-radius: 8px;"></div>`,
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @Input() destinations: any[] = [];

  private map!: L.Map; // <-- correction : opérateur "!" pour indiquer une initialisation ultérieure

  ngAfterViewInit(): void {
    this.initMap();
    this.addMarkers();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove(); // nettoyage pour éviter les fuites mémoire
    }
  }

  private initMap(): void {
    this.map = L.map('map').setView([46.2276, 2.2137], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  private addMarkers(): void {
    // Coordonnées approximatives pour quelques destinations (à compléter selon votre liste)
    const coords: { [key: string]: [number, number] } = {
      'Paris': [48.8566, 2.3522],
      'Tokyo': [35.6762, 139.6503],
      'New York': [40.7128, -74.0060],
      'Londres': [51.5074, -0.1278],
      'Rome': [41.9028, 12.4964],
      'Bangkok': [13.7563, 100.5018],
      'Marrakech': [31.6295, -7.9811],
      // Ajoutez d'autres villes selon vos destinations
    };

    this.destinations.forEach(dest => {
      const latLng = coords[dest.name];
      if (latLng) {
        L.marker(latLng)
          .addTo(this.map)
          .bindPopup(`<b>${dest.name}</b><br>${dest.country}`);
      }
    });
  }
}