import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import * as fossils from "../../assets/fossil_n.json"
import * as fishes from "../../assets/fish_n.json"
import * as insects from "../../assets/mushi_n.json"
import * as art from "../../assets/art_n.json"
import {AnimalService} from '../_services/animal.service'
import { ActivatedRoute } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	displayedColumns: string[] = ['position', 'name', 'price', 'time', 'hour', 'rare', 'donated', 'stock'];
	dataSource: any;
	selected = "fish";
	length = 100;
	pageSize = 10;
	pageSizeOptions: number[] = [5, 10, 25, 100];
	currentKey: any;
	userKey: any;
	sub: any;
	name: string;
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	response = {};
	disabled: any = false;
	saving: boolean = false;
	friend:boolean;
	query: string;
	@ViewChild('searchText') input: ElementRef; 
	private subject: Subject<string> = new Subject();
	
	copyMessage(){
		const selBox = document.createElement('textarea');
		selBox.style.position = 'fixed';
		selBox.style.left = '0';
		selBox.style.top = '0';
		selBox.style.opacity = '0';
		selBox.value = 'https://itemxing.29a.org/dashboard/'+this.userKey;
		document.body.appendChild(selBox);
		selBox.focus();
		selBox.select();
		document.execCommand('copy');
		document.body.removeChild(selBox);
		this.snackBar.open('Link copied to clipboard', 'Close', {duration:3000});
	}
	
	handleSearch(val) {
		let searchIn = [];
		if(this.selected=="fish"){
			searchIn = fishes.fish;
		}else if(this.selected=="fossil"){
			searchIn = fossils.fossil;
		}else if(this.selected=="insect"){
			searchIn = insects.insects;
		}else if(this.selected=="art"){
			searchIn = art.art;
		}
		if(val.length == 0){
			this.dataSource = new MatTableDataSource<any>(searchIn);
			this.paginator.pageIndex = 0;
			this.paginator.firstPage();
			this.dataSource.paginator = this.paginator;
		}
		if(val.length < 2)
			return
		let res = searchIn.filter(item => item.name.toLowerCase().indexOf(val.toLowerCase()) !== -1 );
		this.dataSource = new MatTableDataSource<any>(res);	
		this.paginator.pageIndex = 0;
		this.paginator.firstPage();
		this.dataSource.paginator = this.paginator;
	}

	onKeyUp(searchTextValue: string){
		this.subject.next(searchTextValue);
	}

	setStock(id, event, iclass){ 
		if(this.response[id]){	
			this.response[id]["stock"] = +event.target.value;
		}else{
			this.response[id] = {id:id, stock:+event.target.value, class:iclass, donated:false}
		}
	}

	setDonated(id, event, iclass){ 
		if(this.response[id]){
			this.response[id]["donated"] = event.checked;
		}else{
			this.response[id] = {id:id, stock:0, class:iclass, donated: event.checked}
		}
	}
	
	addFriend() {
		this.animalService.add_friend(this.currentKey, this.name).subscribe(res => {
			this.friend = true;
		})
	}
	
	save() {
		this.saving = true;
		this.animalService.set_inventory(this.response, this.userKey).subscribe(res => {
			this.snackBar.open('List Saved!', 'Close', {duration:3000});
			this.saving = false;
		}, err => {
			this.snackBar.open('Something went wrong! Retry?', 'Close', {duration:3000});
			this.saving = false;
		});
	}

	onChange($event){
		this.input.nativeElement.value = "";
		if(this.selected == 'fossil') {
			this.length = fossils.fossil.length;
			this.displayedColumns = ['position', 'donated', 'stock', 'name', 'price'];
			this.dataSource = new MatTableDataSource<any>(fossils.fossil); 
		} else if(this.selected == 'fish') {
			this.length = fishes.fish.length;
			this.displayedColumns = ['position', 'donated', 'stock', 'name', 'price', 'time', 'hour', 'rare'];
			this.dataSource = new MatTableDataSource<any>(fishes.fish); 
		} else if (this.selected == 'insect') {
			this.length = insects.insects.length;
			this.displayedColumns = ['position', 'donated', 'stock', 'name', 'price', 'time', 'hour' ];
			this.dataSource = new MatTableDataSource<any>(insects.insects);	
		} else if (this.selected == 'art') {
			this.length = art.art.length;
			this.displayedColumns = ['position', 'donated', 'stock', 'name'];
			this.dataSource = new MatTableDataSource<any>(art.art);	
		}
		this.paginator.pageIndex = 0;
		this.paginator.firstPage();
		this.dataSource.paginator = this.paginator;
	}

	constructor(private animalService: AnimalService,private route: ActivatedRoute,private snackBar: MatSnackBar) {}

	ngOnInit(): void {
		this.length = fishes.fish.length;
		this.displayedColumns = ['position', 'donated', 'stock', 'name', 'price', 'time', 'hour', 'rare'];
		this.dataSource = new MatTableDataSource<any>(fishes.fish)
		this.dataSource.paginator = this.paginator;
	
		this.sub = this.route.params.subscribe(params => {
			let currentUser = JSON.parse(localStorage.getItem('currentUser')); 
			this.userKey = currentUser.idAnimal;
			if(params['userkey']){
				this.currentKey = params['userkey'];
			}else{
				this.currentKey = this.userKey;
			}
			if(this.currentKey !== this.userKey){
				this.disabled = true;
				this.animalService.check_friend(this.currentKey).subscribe(res => {
					this.friend = true; 
					// Check note in service
					this.animalService.update_friend(this.currentKey).subscribe();
				},
				err =>{
					this.friend = false;
				});
			}else{
				this.disabled = false;
			}
			this.animalService.get_other_profile(this.currentKey).subscribe(res => {
				this.name = res.name;
			},
			_e => {
				this.name = this.currentKey;
			})
			let reqs = [this.animalService.get_inventory('fossil', this.currentKey),
					this.animalService.get_inventory('fish', this.currentKey),
					this.animalService.get_inventory('insect', this.currentKey),
					this.animalService.get_inventory('art', this.currentKey)	]
				forkJoin(reqs).subscribe(results => {
				this.response = Object.assign(results[0], results[1], results[2], results[3]);
			});
			this.selected ="fish";
			this.length = fishes.fish.length;
			this.displayedColumns = ['position', 'donated', 'stock', 'name', 'price', 'time', 'hour', 'rare'];
			this.dataSource = new MatTableDataSource<any>(fishes.fish)
			this.paginator.pageIndex = 0;
			this.paginator.firstPage();
			this.dataSource.paginator = this.paginator;
		});
		
		this.subject.pipe(
		  debounceTime(500)
		).subscribe(searchTextValue => {
		  this.handleSearch(searchTextValue);
		});
		
	}

}
