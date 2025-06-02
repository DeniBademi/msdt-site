import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import {SignUpComponent} from './pages/sign-up/sign-up.component';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';//E
import { RouterModule } from '@angular/router';//E
import { SavedAnswersComponent } from './pages/saved-answers/saved-answers.component';//E
import { AdminGuard } from './_guards/admin.guard';
import { AuthGuard } from './_guards/auth.guard';
export enum AppRoutes {
  LOGIN = 'login',
  SIGNUP = `sign-up`,
  HOME = 'home',
  SAVEDANSWERS = 'saved-answers'

}

export const routes: Routes = [
  {path: '', redirectTo: AppRoutes.LOGIN, pathMatch: 'full'},
  {path: AppRoutes.LOGIN, component: LoginComponent},
  {path: AppRoutes.SIGNUP, component: SignUpComponent},
  {path: AppRoutes.HOME, component: HomeComponent, canActivate: [AuthGuard]},
  {path: AppRoutes.SAVEDANSWERS, component: SavedAnswersComponent, canActivate: [AdminGuard]},//E
]

//E
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
