import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  searchQuery: string = '';
  historial: any[] = []; // Historial completo desde Firebase
  filteredHistorial: any[] = []; // Historial filtrado
  startDate: string = ''; // Fecha de inicio seleccionada
  endDate: string = ''; // Fecha de fin seleccionada

  constructor(private fireStore: AngularFirestore) {}

  ngOnInit() {
    this.loadHistorial(); // Cargar historial de asistencia desde Firebase
  }

  // Cargar historial desde Firebase
  loadHistorial() {
    this.fireStore
      .collection('asistencias') // Colección de asistencias en Firebase
      .valueChanges({ idField: 'id' }) // Incluye el ID del documento
      .subscribe((data: any[]) => {
        this.historial = data; // Asignar los datos obtenidos
        this.filteredHistorial = data; // Inicializar el historial filtrado
      });
  }

  // Método para buscar por nombre o RUT
  onSearch(event: any) {
    const query = event.detail.value.toLowerCase();
    this.filteredHistorial = this.historial.filter((item) =>
      item.nombre_empleado.toLowerCase().includes(query) ||
      item.apellido_empleado.toLowerCase().includes(query) ||
      item.empleado_id.includes(query)
    );
  }

}
