import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ShoppingListService } from '../../services/shopping-list';
import { Ingredient } from '../../models/ingredient';
import { PopoverController, LoadingController, AlertController } from 'ionic-angular';
import { SLOptionsPage } from './sl-options/sl-options';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html'
})
export class ShoppingListPage {

  listItems: Ingredient[];

  constructor(private slService: ShoppingListService,
              private popOverCtrl: PopoverController,
              private authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController) {

  }

  ionViewWillEnter() {
    this.loadItems();
  }

  onAddItem(form: NgForm) {
    this.slService.addItem(form.value.ingredientName, form.value.amount);
    form.reset();
    this.loadItems();
  }

  private loadItems() {
    this.listItems = this.slService.getItems();
  }

  onCheckItem(index: number) {
    this.slService.removeItem(index);
    this.loadItems();
  }

  onShowOptions(event: MouseEvent) {
      const loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      const popover = this.popOverCtrl.create(SLOptionsPage);
      popover.present({ev: event});
      popover.onDidDismiss(
        data => {
          if (data.action == 'load') {
            loading.present();
            this.authService.getActiveUser().getIdToken()
              .then(
                (token: string) => {
                  this.slService.fetchList(token)
                    .subscribe((list: Ingredient[]) => {
                      loading.dismiss();
                      if (list) {
                        this.listItems = list;
                      } else {
                        this.listItems = [];
                      }
                    },
                      error => {
                        loading.dismiss();
                        this.alertHandler(error);
                        console.log(error);
                      }
                    );
                }
              );
          } else if (data.action == 'store') {
            loading.present();
            this.authService.getActiveUser().getIdToken()
              .then(
                (token: string) => {
                  this.slService.storeList(token)
                    .subscribe(() => {
                      console.log("success");
                      loading.dismiss();
                    },
                      error => {
                        loading.dismiss();
                        this.alertHandler(error);
                        console.log(error);
                      }
                    );
                }
              );
          }
        }
      )
  }

  private alertHandler(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: 'An error occurred!',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }

}
