import { Component, OnInit } from '@angular/core';
import { AuthService } from "angularx-social-login";
import { AnimalService } from "../_services/animal.service";
import { GoogleLoginProvider } from "angularx-social-login";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	constructor(private authService: AuthService,
				private animalService: AnimalService,
				private router: Router) { }

	signInWithGoogle(): void {
		this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((userData) => {
			localStorage.setItem('currentUser', JSON.stringify(userData));
			this.animalService.register().subscribe(res =>{
				let currentUser = JSON.parse(localStorage.getItem('currentUser'));
				currentUser["idAnimal"] = res.id;
				localStorage.setItem('currentUser', JSON.stringify(currentUser));
				this.router.navigate([`/dashboard/${res.id}`]);
			})
		});
	}

	signOut(): void {
		this.authService.signOut();
	}

	ngOnInit(): void {
		let currentUser = JSON.parse(localStorage.getItem('currentUser'));
		if(currentUser){
			this.router.navigate([`/dashboard/${currentUser["idAnimal"]}`]);
		}
	}

}
