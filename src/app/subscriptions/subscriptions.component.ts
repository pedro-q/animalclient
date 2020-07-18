import { Component, OnInit } from '@angular/core';
import {AnimalService} from '../_services/animal.service' 

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
	subscriptions: any; 

	constructor(public service: AnimalService) { }
	
	delete(index, id){
		this.service.delete_friend(id).subscribe(res => {
			this.subscriptions.splice(index, 1);
		});
	}

	ngOnInit(): void {
		this.service.get_friends().subscribe(res => {
			this.subscriptions = res;
		})
	}

}
