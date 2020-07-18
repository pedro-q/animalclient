import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, EMPTY,  } from 'rxjs';
import { catchError, switchMap, retryWhen, tap } from 'rxjs/operators';
import { AnimalService } from '../_services/animal.service';
import { from } from 'rxjs';

export const InterceptorRefreshHeader = 'X-Skip-Interceptor';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	private retryRequest = Symbol('reload');
	private endRequest = Symbol('end');

	constructor(private animalService: AnimalService) {}

	private refreshToken(currentUser): Observable<any> {
		return from(this.animalService.refresh()).pipe(
			tap(userData => {
				userData["idAnimal"] = currentUser["idAnimal"];
				localStorage.setItem('currentUser', JSON.stringify(userData));
				throw this.retryRequest;
			}),
			tap(error => { 
					throw this.endRequest; 
				}
			)
		);
	}

	private addToken(request: HttpRequest<any>): HttpRequest<any> {
		// add authorization header 
		let currentUser = JSON.parse(localStorage.getItem('currentUser')); 
		if (currentUser && currentUser.idToken) {
			request = request.clone({
				setHeaders: {
					Authorization: `Bearer ${currentUser.idToken}`
				}
			});
		}else{
			console.log("no habia user?");
		}
		return request
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const request$ = new Observable<HttpRequest<any>>(observer => { 
			const rq = this.addToken(request); 
			observer.next(rq);
			observer.complete();
		});
		return request$.pipe(
			switchMap(req => next.handle(req)),
			catchError((err: Error) => {
				if (err instanceof HttpErrorResponse) {
						if (err.status === 401) { 
							let currentUser = JSON.parse(localStorage.getItem('currentUser')); 
							if (currentUser) {
								return this.refreshToken(currentUser)
							}else{
								throw err;
							}
						}else{
							//throwError(err);
							throw err;
						}
				} else {
					throwError(err);
				}
				return EMPTY;
			}),
			retryWhen(err$ =>
				err$.pipe(
					tap(err => { 
						if (err === this.retryRequest) { return; }
						if (err === this.endRequest) { throw err; }
						throw err;
					})
				)
			))
	}

}