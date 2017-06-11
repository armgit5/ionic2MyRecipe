import { Component } from '@angular/core';
import { NavController, LoadingController, PopoverController, AlertController } from 'ionic-angular';
import { EditRecipePage } from '../edit-recipe/edit-recipe';
import { Recipe } from '../../models/recipes';
import { RecipesService } from '../../services/recipes';
import { RecipePage } from '../recipe/recipe';
import { AuthService } from '../../services/auth';
import { DatabaseOptionsPage } from '../database-options/database-options';

@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html'
})
export class RecipesPage {

  recipes: Recipe[];

  constructor(private navCtrl: NavController,
              private recipesService: RecipesService,
              private authService: AuthService,
              private loadingCtrl: LoadingController,
              private popOverCtrl: PopoverController,
              private alertCtrl: AlertController) {

  }

  ionViewWillEnter() {
    this.recipes = this.recipesService.getRecipes();
    // console.log(this.recipes);
  }

  onNewRecipe() {
    this.navCtrl.push(EditRecipePage, {mode: 'New'});
  }

  onLoadRecipe(recipe: Recipe, index: number) {
    this.navCtrl.push(RecipePage, {recipe: recipe, index: index});
  }

   onShowOptions(event: MouseEvent) {
      const loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      const popover = this.popOverCtrl.create(DatabaseOptionsPage);
      popover.present({ev: event});
      popover.onDidDismiss(
        data => {
          if (data == null) {
            console.log("no action");
          } else if (data.action == 'load') {
            loading.present();
            this.authService.getActiveUser().getIdToken()
              .then(
                (token: string) => {
                  this.recipesService.fetchList(token)
                    .subscribe((recipes: Recipe[]) => {
                      loading.dismiss();
                      if (recipes) {
                        this.recipes = recipes;
                      } else {
                        this.recipes = [];
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
                  this.recipesService.storeList(token)
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
