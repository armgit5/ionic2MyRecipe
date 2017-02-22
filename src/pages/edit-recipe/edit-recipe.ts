import { Component, OnInit } from '@angular/core';
import { NavParams, ActionSheetController, AlertController, ToastController, NavController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { RecipesService } from '../../services/recipes';
import { Recipe } from '../../models/recipes';
import { Ingredient } from '../../models/ingredient';


@Component({
  selector: 'page-edit-recipe',
  templateUrl: 'edit-recipe.html'
})
export class EditRecipePage implements OnInit {

  mode = 'New';
  selectOptions = ['Easy', 'Medium', 'Hard'];
  recipeForm: FormGroup;
  recipe: Recipe;
  index: number;

  constructor(private navParams: NavParams,
              private actionSheetController: ActionSheetController,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private recipesService: RecipesService,
              private navCtrl: NavController,
              private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.mode = this.navParams.get('mode');
    if (this.mode == 'Edit') {
      this.recipe = this.navParams.get('recipe');
      this.index = this.navParams.get('index');
    }
    this.initializeForm();
  }

  onSubmit() {
    const value = this.recipeForm.value;
    
    if (this.mode == 'Edit') {
      this.recipesService.updateRecipe(this.index, value.title, value.description, value.difficulty, 
      value.ingredients);
    } else {
      this.recipesService.addRecipe(value.title, value.description, value.difficulty, 
      value.ingredients);
    }
    
    this.recipeForm.reset();
    this.navCtrl.popToRoot();
  }

  onManageIndredients() {
    const actionSheet = this.actionSheetController.create({
      title: 'What do you want to do?',
      buttons: [
        {
          text: 'Add Ingredient',
          handler: () => {
            this.createNewIngredientAlert().present();
          }
        },
        {
          text: 'Remove all Ingredients',
          role: 'destructive',
          handler: () => {
            const fArray: FormArray = <FormArray>this.recipeForm.get('ingredients');
            const len = fArray.length;
            if (len > 0) {
              for (let i = len-1; i >= 0; i--) {
                fArray.removeAt(i);
              }
              const toast = this.toastCtrl.create({
                message: 'All Ingredients were deleted!',
                duration: 1500,
                position: 'bottom'
              });
              toast.present();
            }
          }
        },
        {
          text: 'Cancel',
          role: 'Cancel'
        }
      ]
    });
    actionSheet.present();
  }

  private createNewIngredientAlert() {
     return this.alertCtrl.create({
      title: 'Add Ingredient',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        },
        {
          name: 'amount',
          placeholder: 'Amount',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: data => {
            if (data.name.trim() == '' || data.name == null) {
              const toast = this.toastCtrl.create({
                message: 'Please enter a valid value!',
                duration: 1500,
                position: 'bottom'
              });
              toast.present();
              return;
            }
            // console.log(data.name, data.amount);
            (<FormArray>this.recipeForm.get('ingredients'))
              .push(this.getIngredientFormGroup(new Ingredient(data.name, data.amount)));
            const toast = this.toastCtrl.create({
              message: 'Item added',
              duration: 1500,
              position: 'bottom'
            });
            toast.present();
          }
        }
      ]
    });
  }

  private getIngredientFormGroup(ingredient: Ingredient): FormGroup{
    const formGroup = this.formBuilder.group({
      name: new FormControl(ingredient.name, Validators.required),
      amount: new FormControl(ingredient.amount, Validators.required)
    });

    return formGroup;
  }

  private initializeForm() {

    console.log("initializeForm");

    let title = null;
    let description = null;
    let difficulty = 'Medium';
    let ingredients = [];

    if (this.mode == 'Edit') {
      title = this.recipe.title;
      description = this.recipe.description;
      difficulty = this.recipe.difficulty;
      
      for (let ingredient of this.recipe.ingredients) {
        console.log(ingredient);
        ingredients.push(this.getIngredientFormGroup(ingredient));
      }      
    
    }

    this.recipeForm = new FormGroup({
      'title': new FormControl(title, Validators.required),
      'description': new FormControl(description, Validators.required),
      'difficulty': new FormControl(difficulty),
      'ingredients': new FormArray(ingredients)
    });
  }

}
