import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import {SignUpComponent} from './pages/sign-up/sign-up.component';
import { HomeComponent } from './pages/home/home.component';
import {VariableDisplayComponent} from './pages/variable-display/variable-display.component';
import { CommonModule } from '@angular/common'; //E
import { NgModule } from '@angular/core';//E
import { RouterModule } from '@angular/router';//E
import { ReactiveFormsModule } from '@angular/forms';//E
import { FormsModule } from '@angular/forms';//E
import { QuestionnaireComponent } from './pages/questionnaire/questionnaire.component';//E
import { SavedAnswersComponent } from './pages/saved-answers/saved-answers.component';//E

export enum AppRoutes {
  LOGIN = 'login',
  SIGNUP = `sign-up`,
  HOME = 'home',
  VARIABLES = 'variable-display',
  MAINPAGE = 'main',
  QUESTIONNAIRE = 'questionnaire', //E
  SAVEDANSWERS = 'saved-answers' //E

}

export const routes: Routes = [
  {path: '', redirectTo: AppRoutes.LOGIN, pathMatch: 'full'},
  {path: AppRoutes.LOGIN, component: LoginComponent},
  {path: AppRoutes.SIGNUP, component: SignUpComponent},
  {path: AppRoutes.HOME, component: HomeComponent},
  {path: AppRoutes.VARIABLES, component: VariableDisplayComponent},
  {path: AppRoutes.MAINPAGE, component: HomeComponent},
  {path: AppRoutes.QUESTIONNAIRE, component: QuestionnaireComponent },//E
  {path: AppRoutes.SAVEDANSWERS, component: SavedAnswersComponent },//E
]

//E
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
