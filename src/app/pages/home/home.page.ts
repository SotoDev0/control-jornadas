import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  empleado: any = {}; // Datos del empleado logueado
  currentTime: string = '';
  estadoJornada: string = ''; // Estado de la jornada
  botonesHabilitados: boolean = true; // Botones siempre habilitados para pruebas

  constructor(
    private userService: UserService,
    private fireStore: AngularFirestore,
    private fireAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.loadEmployeeData(); // Cargar datos del empleado al iniciar la página
    this.startClock();
  }

  // Método para cargar los datos del empleado desde localStorage
  loadEmployeeData() {
    const storedEmployee = localStorage.getItem('usuario');
    if (storedEmployee) {
      this.empleado = JSON.parse(storedEmployee); // Cargar datos del usuario desde localStorage
    } else {
      console.log('No se encontró información del empleado en localStorage');
    }
  }

  // Reloj que actualiza la hora cada segundo
  startClock() {
    setInterval(() => {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString();
    }, 1000);
  }

  // Métodos para iniciar y finalizar la jornada
  async iniciarJornada() {
    try {
      const fechaInicio = new Date();
  
      const jornadaData = {
        empleado_id: this.empleado.rut,
        nombre_empleado: this.empleado.nombre,
        apellido_empleado: this.empleado.apellido,
        sucursal_nombre: this.empleado.sucursal,
        fecha_inicio: fechaInicio,
        estado: 'iniciado',
      };
  
      // Generar un identificador único basado en el timestamp
      const jornadaId = `${this.empleado.rut}_${fechaInicio.getTime()}`;
  
      // Guardar el identificador en localStorage
      localStorage.setItem('jornadaActual', jornadaId);
  
      // Guardar datos en Firestore
      await this.fireStore.collection('asistencias').doc(jornadaId).set(jornadaData);
  
      console.log('Jornada iniciada correctamente');
      this.estadoJornada = 'iniciado';
    } catch (error) {
      console.error('Error al iniciar la jornada:', error);
    }
  }

  async finalizarJornada() {
    try {
      const fechaFin = new Date();
  
      // Recuperar el identificador de la jornada actual desde localStorage
      const jornadaId = localStorage.getItem('jornadaActual');
  
      if (!jornadaId) {
        console.error('No se encontró una jornada iniciada para finalizar');
        return;
      }
  
      // Actualizar el documento de la jornada en Firestore
      await this.fireStore.collection('asistencias').doc(jornadaId).update({
        fecha_fin: fechaFin,
        estado: 'finalizado',
      });
  
      // Actualizar el estado en localStorage (opcional)
      const jornadaData = JSON.parse(localStorage.getItem(`asistencia_${jornadaId}`) || '{}');
      jornadaData.fecha_fin = fechaFin;
      jornadaData.estado = 'finalizado';
      localStorage.setItem(`asistencia_${jornadaId}`, JSON.stringify(jornadaData));
  
      console.log('Jornada finalizada correctamente');
      this.estadoJornada = 'finalizado';
  
      // Limpiar el identificador de la jornada actual
      localStorage.removeItem('jornadaActual');
    } catch (error) {
      console.error('Error al finalizar la jornada:', error);
    }
  }
  
}
