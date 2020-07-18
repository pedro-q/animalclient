import { Component, OnInit  } from '@angular/core';
import { Router } from "@angular/router";
import { AnimalService } from "./_services/animal.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'Item Crossing';
	currId: any;
	
	constructor(public router: Router,
				private animalService: AnimalService) { }

	goToId(){
		let currId = this.animalService.getCurrId();
		this.router.navigate([`/dashboard/${currId}`]);
	}
	
	ngOnInit(): void { }
}
