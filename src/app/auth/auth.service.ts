import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {BehaviorSubject, Subject, throwError} from 'rxjs';
import {UserModel} from './user.model';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

export interface AuthResponseData {
  kind: string;
  idToken: string ;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new BehaviorSubject<UserModel>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient , private router: Router) {
  }

  signUp(email: string , password: string) {
    // tslint:disable-next-line:max-line-length
    return  this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseApiKey,
      {email : email ,
        password: password ,
        returnSecureToken: true }
    ).pipe(catchError(this.handleError), tap(resData => {
        // @ts-ignore
        this.handleAuthentication(resData.email , resData.localId , resData.idToken ,  +resData.expiresIn);
      })
    );
  }


  login(email: string , password: string) {
    // tslint:disable-next-line:max-line-length
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey,
      { email : email ,
        password: password ,
        returnSecureToken: true
      }
    ).pipe(catchError(this.handleError), tap(resData => {
      console.log('data is ');
      console.log(resData);
      // @ts-ignore
      this.handleAuthentication(resData.email , resData.localId , resData.idToken ,  +resData.expiresIn);
    }));
  }


  public autoLogin() {
   const userData: {
     email: string,
     id: string,
     _token: string,
     _tokenExpirationDate: string
   } =  JSON.parse(localStorage.getItem('userData'));
   if (!userData) {
     return ;
   }
   const loadedUser = new UserModel(userData.email ,
                      userData.id ,
                      userData._token ,
                      new Date(userData._tokenExpirationDate));

   if (loadedUser.token) {
     console.log('date is');
     console.log(userData._tokenExpirationDate );
     this.user.next(loadedUser);
     const expiratonDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime() ;
     this.autoLogout(expiratonDuration);

   }

  }

  public logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.router.navigate(['/auth']);
  }

  public autoLogout(expirationDuration: number) {
   this.tokenExpirationTimer = setTimeout( () => {
      this.logout();
    } , expirationDuration);
  }


  private handleAuthentication(email: string , userid: string , token: string , expiresIn: number) {
    const expirationData = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new UserModel(email , userid , token , expirationData);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData' , JSON.stringify(user));
    console.log('user Data is ');
    console.log(user);
  }

  private handleError(errorRes: HttpErrorResponse) {
    console.log(errorRes);
    let errorMessage = 'An unknown error Has occured' ;
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS' :
        errorMessage = 'this email exists already';
        break;
      case 'EMAIL_NOT_FOUND' :
        errorMessage = 'this email does not exist';
        break;
      case 'INVALID_PASSWORD' :
        errorMessage = 'this password is not correct';
        break;
    }
    return throwError(errorMessage);
  }

}
