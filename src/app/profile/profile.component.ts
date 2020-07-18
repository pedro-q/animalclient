import { Component, OnInit } from '@angular/core';
import {AnimalService} from '../_services/animal.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
	myForm: FormGroup;
	
	onSubmit(){
		if(this.myForm.invalid)
			return
		this.service.set_profile(this.myForm.value).subscribe(res => {
			
		})
	}

	constructor(public service: AnimalService,private fb: FormBuilder) { }

	ngOnInit(): void {
		this.myForm = this.fb.group({
			name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
		});
		this.service.get_profile().subscribe(res => {
			this.myForm.controls.name.setValue(res.name);
		})
	}

}
