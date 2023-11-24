import { Component, OnInit, Inject } from '@angular/core';
import { User } from '../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.page.html',
  styleUrls: ['./user-details.page.scss'],
})
export class UserDetailsPage implements OnInit {
  userId: string;
  userProfile: User;

  constructor(
    private activatedRoute: ActivatedRoute,
    private firebaseSvc: FirebaseService, // Mantén la inyección de FirebaseService si la necesitas
    private utilsSvc: UtilsService // Mantén la inyección de UtilsService si la necesitas
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.userId = params.get('userId');
      if (this.userId) {
        this.getUserDetails(this.userId);
      }
    });
  }


  getUserDetails(userId: string) {
    console.log('Fetching user details for userId:', userId); // Verifica el 'userId' para la solicitud
    this.firebaseSvc.getUserData(userId).then(user => {
      if (user) {
        this.userProfile = user;
      }
    });
  }

}

