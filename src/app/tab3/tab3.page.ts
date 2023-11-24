import { Component, inject } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  userVideos: any[] = [];


  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService,
    private auth: AngularFireAuth,  // Agrega esto
    private firestore: AngularFirestore
  ) {}

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  redirectToLink(link: string) {
    window.location.href = link; // Redirige a la URL proporcionada
  }



  redirectToFacebook() {
    const userData: any = this.user(); // Suponiendo que el enlace de Facebook está en userData.facebook
    if (userData && userData.facebook) {
      this.redirectToLink(userData.facebook);
    } else {
      console.log('No se encontró el enlace de Facebook');
    }
  }

  redirectToInstagram() {
    const userData: any = this.user(); // Suponiendo que el enlace de Instagram está en userData.instagram
    if (userData && userData.instagram) {
      this.redirectToLink(userData.instagram);
    } else {
      console.log('No se encontró el enlace de Instagram');
    }
  }

  redirectToTwitter(){
    const userData: any = this.user(); // Suponiendo que el enlace de Instagram está en userData.instagram
    if (userData && userData.twitter) {
      this.redirectToLink(userData.twitter);
    } else {
      console.log('No se encontró el enlace de Instagram');
    }
  }
  // Agrega métodos similares para otros enlaces...

  signOut() {
    this.firebaseSvc.signOut().then(() => {
      this.utilsSvc.router.navigate(['/login']);
      console.log('Se cerró la sesión correctamente');
    }).catch(error => {
      console.log('Error al cerrar sesión:', error);
    });
  }

  async loadUserVideos() {
    const user = await this.auth.currentUser;
    if (user) {
      this.firestore.collection('videos', ref => ref.where('userId', '==', user.uid))
        .valueChanges()
        .subscribe((videos: any[]) => {
          console.log('Videos recuperados de la base de datos:', videos);
          this.userVideos = videos.map(video => {
            console.log('Estructura de un video:', video); // Agrega esta línea
            return {
              videoURL: video.videoURL,
            };
          });
        });
    }
  }

  ngOnInit() {
    this.loadUserVideos();
  }
}