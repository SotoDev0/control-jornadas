import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GeoPoint } from '@angular/fire/firestore';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  empleado: any = {}; // Aquí guardaremos los datos del empleado logueado
  currentTime: string = '';
  estadoJornada: string = ''; // Nueva propiedad para el estado de la jornada

  constructor(private userService: UserService,
    private fireStore: AngularFirestore,
    private fireAuth: AngularFireAuth
  ) { }

  
  ngOnInit() {
    this.loadEmployeeData(); // Cargar los datos del empleado cuando se inicia la página
    this.startClock();
  }

  // Método para cargar los datos del empleado desde localStorage
  loadEmployeeData() {
    const storedEmployee = localStorage.getItem('usuario');
    if (storedEmployee) {
      this.empleado = JSON.parse(storedEmployee); // Si el usuario está guardado en localStorage, lo cargamos
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
      const ubicacion = await this.registrarUbicacion(); // Método para obtener la ubicación actual
      
      // Obtener el usuario actual utilizando su UID
      const usuario = await this.obtenerUsuarioActual();
      const empleadoId = usuario.uid;

      // Obtener los detalles completos del usuario desde Firestore
      const usuarioCompleto = await this.userService.getUsuarioByUID(empleadoId);
      
      if (!usuarioCompleto) {
        console.log('No se encontró información del usuario en Firestore');
        return false;
      }

      const fechaInicio = new Date();
      
       // Actualizar el estado de la jornada a 'iniciado'
       this.estadoJornada = 'iniciado'; // Establecer el estado a 'iniciado'


      const jornadaData = {
        empleado_id: usuarioCompleto.rut,
        nombre_empleado: usuarioCompleto.nombre,
        sucursal_nombre: usuarioCompleto.sucursal,
        fecha_inicio: fechaInicio,
        estado: 'iniciado',
        ubicacion_inicio: ubicacion,
        ubicacion_fin: null,
      };
  
      const docRef = this.fireStore.collection('asistencias').doc(usuarioCompleto.rut);
      await docRef.set(jornadaData);
  
      console.log('Jornada iniciada correctamente');
      return true;
    } catch (error) {
      console.error('Error al iniciar la jornada:', error);
      return false;
    }
  }
  
  

  finalizarJornada() {
  try {
    // Obtener la fecha de finalización
    const fechaFin = new Date();
    
    // Actualizar el estado de la jornada a 'finalizado'
    this.estadoJornada = 'finalizado'; 

    // Actualizar el documento de la jornada en Firestore
    this.fireStore.collection('asistencias').doc(this.empleado.rut).update({
      fecha_fin: fechaFin,  // Agregar la fecha de finalización
      estado: 'finalizado'  // Cambiar el estado a 'finalizado'
    }).then(() => {
      console.log('Jornada finalizada correctamente');
    }).catch((error) => {
      console.error('Error al finalizar la jornada:', error);
    });
  } catch (error) {
    console.error('Error al finalizar la jornada:', error);
  }
}



  // Método para obtener el usuario actual
  async obtenerUsuarioActual() {
    const usuario = await this.fireAuth.currentUser;  // Obtener el usuario autenticado
    if (usuario) {
      return usuario;  // Retorna el objeto del usuario
    } else {
      throw new Error("No hay usuario autenticado");
    }
  }


  // Método para registrar la ubicación
  async registrarUbicacion() {
    return new Promise<GeoPoint>((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const ubicacion = new GeoPoint(lat, lon); // Crear un GeoPoint con latitud y longitud
            resolve(ubicacion);
          },
          (error) => {
            reject('Error al obtener la ubicación: ' + error.message);
          }
        );
      } else {
        reject('Geolocalización no es soportada en este navegador');
      }
    });
  }
}
