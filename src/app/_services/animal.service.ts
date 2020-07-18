import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { environment } from './../../environments/environment';
import { of } from 'rxjs';
import { forkJoin } from 'rxjs';
import { retry } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AnimalService {
	baseUrl = environment.baseUrl;

	constructor(private http: HttpClient,
				private authService: AuthService) { }

	refresh() {
		return this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
	}

	getCurrId(){
		let currUsr = JSON.parse(localStorage.getItem('currentUser')); 
		if(currUsr) {
			return currUsr["idAnimal"];
		} else {
			return null;
		}
	}
	
	register() {
		const endpoint = this.baseUrl + '/subscriber/register'
		return this.http.post(endpoint, {}).pipe(
				map((res: any) => { return res; })
		);
	}

	get_inventory(cat, userkey) {
		const endpoint = this.baseUrl + `/class/${cat}/${userkey}`
		return this.http.get(endpoint, {}).pipe(
				map((res: any) => {
					let obj = res.reduce(function(acc, curr) {
						acc[curr.id] = curr;
						return acc;
					}, {});
					return obj;
				})
		);
	}
	
	get_other_profile(id) {
		const endpoint = this.baseUrl + `/profile/${id}`;
		return this.http.get<any>(endpoint, {})
	}
	
	get_profile() {
		const endpoint = this.baseUrl + `/profile`;
		return this.http.get<any>(endpoint, {})
	}
	
	set_profile(profile) {
		const endpoint = this.baseUrl + `/profile`;
		return this.http.post(endpoint, profile)
	}

	check_friend(id) {
		const endpoint = this.baseUrl + `/check/friend/${id}`;
		return this.http.get<any>(endpoint, {})
	}

	delete_friend(id) {
		const endpoint = this.baseUrl + `/friend/${id}`;
		return this.http.delete<any>(endpoint, {headers: {'Content-Type': 'application/json'}})
	}
	
	add_friend(id, name) {
		const endpoint = this.baseUrl + `/friend`;
		return this.http.post(endpoint, {id, name}).pipe(
				map((res: any) => { return res; })
		);
	}
	
	get_friends() {
		const endpoint = this.baseUrl + '/friends';
		return this.http.get<any>(endpoint, {})
	}
	
	/* So this is a little weird but you can't update a
	 * friend, this is just so I can mantain the user's
	 * list of friends with updated names, because
	 * redis isn't a relational database I can't update
	 * everyone list of friends if somebody changes names
	 */
	update_friend(id) {
		const endpoint = this.baseUrl + `/friend`;
		return this.http.put(endpoint, {id, name:""}).pipe(
				map((res: any) => { return res; })
		);
	}

	set_inventory(inv: any, userkey){
		let list_fish = [];
		let list_insect = [];
		let list_fossil = [];
		let list_art = [];
		for(const key in inv){
			const item = inv[key];
			if(item['class'] == 'fish'){
				list_fish.push(item);
			}else if (item['class'] == 'insect'){
				list_insect.push(item);
			}else if(item['class'] =='fossil'){
				list_fossil.push(item);
			}else if(item['class'] =='art'){
				list_art.push(item);
			}
		}
		const endpoint = this.baseUrl;
		const reqs = [this.http.post(endpoint+`/class/fish`, list_fish),
					  this.http.post(endpoint+`/class/fossil`, list_fossil),
					  this.http.post(endpoint+`/class/art`, list_art),
					  this.http.post(endpoint+`/class/insect`, list_insect)]
		return forkJoin(reqs.map(request => request.pipe(retry(3))))
	}

}
