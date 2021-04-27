import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Post } from '../models/post.model';


@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.page.html',
  styleUrls: ['./add-post.page.scss'],
})
export class AddPostPage implements OnInit {
  post = {} as Post
  constructor(
    private toastCtrl: ToastController, 
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private firestore: AngularFirestore
  ) { }

  ngOnInit() {
  }
  async createPost(post: Post){
    if (this.formValidation()){
      let loader = this.loadingCtrl.create({
        message:"Por favor espere..."
      });
      (await loader).present();
      try{
        await this.firestore.collection("posts").add(post);
      }catch(e){
        this.showToast(e);
      }
      (await loader).dismiss();
      this.navCtrl.navigateRoot("home");
    }
  }

  formValidation(){
    if(!this.post.title){
      this.showToast("Ingrese el título");
      return false;
    }
    if(!this.post.details){
      this.showToast("Ingrese los detalles");
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
