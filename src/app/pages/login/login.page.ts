import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { auth } from 'src/app/firebase.config';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  //NgModel:
  email:string = '';
  password:string = "";

  constructor(private router: Router,
    private userService : UserService,
    private fireAuth: AngularFireAuth
   ) { }

  ngOnInit() {
  }

  //Metodo asociado al boton para el login
  login(){

    // Validar campos vacíos
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
  
        // Usar el servicio FireService para obtener los datos del usuario
        this.userService.getUsuarioByUID(uid)
          .then((userData) => {
            if (userData) {
              console.log('Datos del usuario:', userData);
    
              // Guardar el objeto del usuario en el localStorage
              localStorage.setItem('usuario', JSON.stringify(userData));
    
              // Redirigir al usuario a la página principal
              this.router.navigate(['/home']);
            } else {
              console.error('El documento del usuario no existe en la base de datos.');
              
            }
          })
          .catch((error) => {
            console.error('Error al obtener los datos del usuario:', error);
           
          });
      })
      .catch((error) => {
        console.error('Error durante el inicio de sesión:', error);
        console.error('Código de error:', error.code);
        console.error('Mensaje del error:', error.message);
        
      })
  }

}
