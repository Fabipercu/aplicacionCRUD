import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { from } from 'rxjs';
import { User } from "../models/user.model"

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  user = {} as User;
  constructor(
    private toastCtrl: ToastController, 
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController
    ) { }

  ngOnInit() {
  }

  async register(user:User){
    if(this.formValidation()){
      let loader = this.loadingCtrl.create({
        message:"Por favor espere..."
      });
      (await loader).present();
      try{
        await this.afAuth.createUserWithEmailAndPassword(user.email, user.password).
        then(data => {
          console.log(data);
          this.navCtrl.navigateRoot("home");
        });
      }catch(e){
        this.showToast(e);
      }

      (await loader).dismiss();
    }
  }
  
  formValidation(){
    if(!this.user.email){
      this.showToast("Ingrese el correo");
      return false;
    }
    if(!this.user.password){
      this.showToast("Ingrese la contraseña");
      return false;
    }
    return true;
  }

  showToast(message: string){
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).then(toastData => toastData.present());
  }
}
