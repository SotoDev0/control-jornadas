import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  searchQuery: string = '';
  historial: any[] = []; // Historial completo desde localStorage
  filteredHistorial: any[] = []; // Historial filtrado
  startDate: string = ''; // Fecha de inicio seleccionada
  endDate: string = ''; // Fecha de fin seleccionada
  isDatePickerOpen: boolean = false; // Estado del modal de selección de fechas
  minDate: string = ''; // Fecha mínima para seleccionar
  maxDate: string = ''; // Fecha máxima para seleccionar

  constructor() {
    // Establecemos un rango de fechas más amplio para el calendario
    const currentDate = new Date();
    this.minDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1)).toISOString();  // Un año atrás
    this.maxDate = new Date().toISOString();  // Fecha actual
    this.loadHistorial();  // Cargar historial de asistencia al iniciar
  }

  ngOnInit() {}

  // Cargar el historial desde localStorage
  loadHistorial() {
    const historial = JSON.parse(localStorage.getItem('historial') || '[]');
    this.historial = historial;
    this.filteredHistorial = historial;  // Inicialmente mostrar todo el historial
  }

  // Método para filtrar el historial por nombre, apellido o fecha  
  onSearch(event: any) {
    const query = event.detail.value.toLowerCase();
    this.filteredHistorial = this.historial.filter(item =>
      item.nombre.toLowerCase().includes(query) ||
      item.apellido.toLowerCase().includes(query) ||
      item.fecha.includes(query)
    );
  }
}

