import { Component } from '@angular/core';
import { HeaderGeneralComponent } from '../header-general/header-general.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features',
  imports: [HeaderGeneralComponent, FormsModule, CommonModule],
  templateUrl: './features.component.html',
  styleUrl: './features.component.css'
})
export class FeaturesComponent {
caracteristicas = [
  {
    titulo: 'Seguridad 24/7',
    descripcion: 'Nuestro parqueadero está vigilado todo el día para mayor tranquilidad.',
    icono: 'bi bi-shield-lock'
  },
  {
    titulo: 'Reservas en línea',
    descripcion: 'Aparta tu espacio desde cualquier lugar con solo unos clics.',
    icono: 'bi bi-calendar-check'
  },
  {
    titulo: 'Tarifas flexibles',
    descripcion: 'Planes por minuto, media hora u hora. Solo pagas por lo que usas.',
    icono: 'bi bi-cash-coin'
  },
  {
    titulo: 'Fácil acceso',
    descripcion: 'Ubicación céntrica con entradas cómodas para cualquier tipo de vehículo.',
    icono: 'bi bi-geo-alt'
  },
  {
    titulo: 'Soporte al cliente',
    descripcion: 'Estamos disponibles para ayudarte ante cualquier duda o inconveniente.',
    icono: 'bi bi-headset'
  },
  {
    titulo: 'Espacios para todos',
    descripcion: 'Contamos con zonas especiales para motos, bicicletas y carros.',
    icono: 'bi bi-car-front'
  }
];

}
