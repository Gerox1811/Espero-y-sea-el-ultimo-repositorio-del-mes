import { Component, inject } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  isFullScreen: boolean = false;
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  userVideos: any[] = [];


  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService,
    private auth: AngularFireAuth,  // Agrega esto
    private firestore: AngularFirestore,
    private renderer: Renderer2, 
    private el: ElementRef
  ) {}

  async loadUserVideos() {
    const user = await this.auth.currentUser;
    if (user) {
      this.firestore.collection('videos', ref => ref.where('userId', '==', user.uid))
        .get()
        .toPromise()
        .then((snapshot) => {
          this.userVideos = snapshot.docs.map(doc => doc.data());
        })
        .catch((error) => {
          console.log('Error al cargar los videos:', error);
        });
    }
  }
  
  ngOnInit() {
    this.loadUserVideos();
  }
  playAndToggle(videoURL: string, event: Event) {
    this.playVideo(videoURL, event);
    this.toggleVideoSize(videoURL);
  }
  

  // Agrega el evento para hacer pantalla completa al hacer clic en el video
  playVideo(videoURL: string, event: Event) {
    const videoElement = event.target as HTMLVideoElement;

    if (videoElement.paused) {
      // Si el video está en pausa, reproduce y ajusta el tamaño
      videoElement.play();
      videoElement.classList.add('enlarged');
    } else {
      // Si el video está reproduciéndose, pausa y restaura el tamaño
      videoElement.pause();
      videoElement.classList.remove('enlarged');
    }
  }

  // Método para manejar el clic en un video para hacerlo más grande
  toggleVideoSize(videoURL: string) {
    const videoElements = document.querySelectorAll('.video-container video');
  
    // Quita la clase "enlarged" de todos los videos
    videoElements.forEach((videoElement: HTMLVideoElement) => {
      videoElement.classList.remove('enlarged');
    });
  
    // Añade la clase "enlarged" solo al video con la URL proporcionada
    const clickedVideo = document.querySelector(`.video-container video[src="${videoURL}"]`);
    if (clickedVideo) {
      clickedVideo.classList.toggle('enlarged');
    }
  }
  
  

  enlargeVideo(videoContainer: HTMLElement) {
    const allVideoContainers = this.el.nativeElement.querySelectorAll('.video-container');
    allVideoContainers.forEach((container: HTMLElement) => {
      this.renderer.removeClass(container, 'enlarged');
    });

    this.renderer.addClass(videoContainer, 'enlarged');
  }

  rearrangeVideos() {
    const allVideoContainers = this.el.nativeElement.querySelectorAll('.video-container');
    allVideoContainers.forEach((container: HTMLElement, index: number) => {
      const isEnlarged = container.classList.contains('enlarged');
      const rowNumber = Math.floor(index / 2); // 2 videos por fila
  
      if (isEnlarged) {
        // Si el video está agrandado, debe ocupar toda la fila
        container.style.width = '100%';
        container.style.order = 'unset'; // Restablece el orden
      } else {
        // Si no está agrandado, puede ocupar la mitad de la fila
        container.style.width = 'calc(50% - 5px)';
        container.style.order = (rowNumber * 2 + 1).toString(); // Convierte a cadena
      }
    });
  }



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

 
}