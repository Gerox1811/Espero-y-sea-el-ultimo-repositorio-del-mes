import { Component } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { User } from '../models/user.model';
import { NavController } from '@ionic/angular'; // Importa NavController


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  currentUser: User | null = null; // Usuario actual
  users: User[] = []; // Lista de usuarios obtenidos de Firebase
  filteredUsers: User[] = []; // Lista de usuarios filtrados
  searchTerm: string = ''; // Término de búsqueda

  constructor(private firebaseSvc: FirebaseService,
    private navCtrl: NavController) {
    this.getUsers(); // Obtener usuarios al inicializar la página
  }

  async getUsers() {
    // Obtener todos los usuarios de Firebase
    this.users = await this.firebaseSvc.getAllUsers();
    this.currentUser = await this.firebaseSvc.getCurrentUser();

    // Excluir al usuario actual de la lista
    this.filteredUsers = this.users.filter(user => user.uid !== this.currentUser?.uid);
  }

  onSearch(event: any) {
    // Asignar el término de búsqueda desde el evento de input
    this.searchTerm = event.target.value.trim().toLowerCase();
    this.filterUsers();
  }

  filterUsers() {
    // Filtrar la lista de usuarios según el término de búsqueda
    this.filteredUsers = this.users.filter(user => {
      const username = user.username.toLowerCase();
      return username.includes(this.searchTerm);
    });
  }

  viewUserProfile(user: User) {
    //this.navCtrl.navigateForward(['/user-details', { userId: user.uid }]);
    console.log('Perfil del usuario seleccionado:', user);
    // Puedes abrir un modal, una página de detalles, o realizar alguna acción para mostrar el perfil completo del usuario.
  }
}
