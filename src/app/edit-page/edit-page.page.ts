import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.page.html',
  styleUrls: ['./edit-page.page.scss'],
})
export class EditPagePage implements OnInit {
  post = {} as Post;
  id: any;
  constructor(
    private actRoute: ActivatedRoute,
    private toastCtrl: ToastController, 
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private firestore: AngularFirestore
    ) {
    this.id = this.actRoute.snapshot.paramMap.get("id");
  }

  ngOnInit() {
    this.getPostById(this.id);
  }

  async getPostById(id: string){
    let loader = this.loadingCtrl.create({
      message:"Por favor espere..."
    });
    (await loader).present();
    this.firestore.doc("posts/" + id).valueChanges().subscribe(data => {
      this.post.title = data["title"];
      this.post.details = data["details"];
    });
    (await loader).dismiss();
  }

  async updatePost(post: Post){
    if(this.formValidation()){
      let loader = this.loadingCtrl.create({
        message:"Por favor espere..."
      });
      (await loader).present();

      try{
        await this.firestore.doc("posts/" + this.id).update(post);
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
