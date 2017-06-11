import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Recipe } from '../../models/recipes';
import { EditRecipePage } from '../edit-recipe/edit-recipe';
import { ShoppingListService } from '../../services/shopping-list';
import { RecipesService } from '../../services/recipes';

@Component({
  selector: 'page-recipe',
  templateUrl: 'recipe.html'
})
export class RecipePage implements OnInit {

  recipe: Recipe;
  index: number;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private slService: ShoppingListService,
              private recipesService: RecipesService,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController
              ) {}

  ngOnInit() {
    this.recipe = this.navParams.get('recipe');
    this.index = this.navParams.get('index');
    // console.log(this.recipe);
  }

  onEditRecipe() {
    this.navCtrl.push(EditRecipePage, {mode: 'Edit', recipe: this.recipe, index: this.index});
  }

  onAddIngredients() {
    this.slService.addItems(this.recipe.ingredients);
    const toast = this.toastCtrl.create({
      message: 'Ingredients have been added to the shopping list',
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
    this.navCtrl.popToRoot();
  }

  onDeleteRecipe() {

    this.alertCtrl.create({
      title: 'Are you sure you want to delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.recipesService.removeRecipe(this.index);
            this.navCtrl.popToRoot();
          }
        }]
    }).present();  
  }

}
