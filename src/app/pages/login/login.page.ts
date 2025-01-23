import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from 'src/app/services/user.service';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from 'src/app/firebase.config';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  
  email: string = '';       // Correo electrónico del usuario
  password: string = '';    // Contraseña del usuario

  constructor(
    private router: Router,
    private userService: UserService,
    private fireAuth: AngularFireAuth
  ) { }

  ngOnInit() {}

  // Método para autenticar al usuario con Firebase
  login() {
    // Validar que los campos no estén vacíos
    if (!this.email || !this.password) {
      console.error('Por favor, ingrese el correo electrónico y la contraseña.');
      return;
    }

    // Autenticar al usuario con Firebase
    signInWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        // Autenticación exitosa
        const user = userCredential.user;
        const uid = user.uid; // Obtener el UID del usuario
        console.log('Usuario autenticado con UID:', uid);

        // Usar el servicio UserService para obtener los datos del usuario
        this.userService.getUsuarioByUID(uid)
          .then((userData) => {
            if (userData) {
              console.log('Datos del usuario:', userData);

              // Guardar el objeto del usuario en localStorage
              localStorage.setItem('usuario', JSON.stringify(userData));

              // Redirigir al usuario a la página principal
              this.router.navigate(['/home']);
            } else {
              console.error('El documento del usuario no existe en la base de datos.');
              alert('No se encontraron datos del usuario.');
            }
          })
          .catch((error) => {
            console.error('Error al obtener los datos del usuario:', error);
            alert('Error al cargar los datos del usuario.');
          });
      })
      .catch((error) => {
        console.error('Error durante el inicio de sesión:', error);
        console.error('Código de error:', error.code);
        console.error('Mensaje del error:', error.message);
        
        alert('Credenciales incorrectas. Intenta nuevamente.');
      });
  }

}