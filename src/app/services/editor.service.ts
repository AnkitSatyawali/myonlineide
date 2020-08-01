import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';

import { environment } from '../../environments/environment';
const URL = 'https://judge0.p.rapidapi.com';
@Injectable({
  providedIn: 'root'
})

export class EditorService {

  constructor(private cookieService:CookieService,private http:HttpClient) { }
  private gotResult = new Subject<Object>();
  result = this.gotResult.asObservable();
  httpOptions;
  setCookies(key,value)
  {
  	this.cookieService.set(key,value);
  }
  getCookies(key)
  {
  	return this.cookieService.get(key);
  }

  SubmitCode(id,code,input) : Observable<any>{
  	this.httpOptions = {
    headers: new HttpHeaders({

      "x-rapidapi-host": environment.host,
	  "x-rapidapi-key": environment.key

    }) 
  	};  
  	let stdin = input.replace(/^\s+|\s+$/g, '');
  	stdin = stdin.trim();
  	let obj;
  	if(stdin!='')
  	{
  		input = btoa(input);
  		code = btoa(code);
  		obj = {
	  		"language_id": id,
			"source_code": code,
    
			"stdin": input,
			"memory_limit": 2048
  		} 
  	} 
  	else
  	{
  		code = btoa(code);
  		obj = {
	  		"language_id": id,
			"source_code": code,
			"memory_limit": 2048
  		} 
  	}
  	 
  	return this.http.post<any>(`${URL}/submissions/?base64_encoded=true`,obj,this.httpOptions)
  }
  getLanguages():Observable<any>{
  	this.httpOptions = {
    headers: new HttpHeaders({

      "x-rapidapi-host": environment.host,
	  "x-rapidapi-key": environment.key

    }) 
  	}; 
  	 
  	return this.http.get<any>(`${URL}/languages`,this.httpOptions);
  }

  getSubmission(token){
  	this.httpOptions = {
    headers: new HttpHeaders({

      "x-rapidapi-host": environment.host,
	  "x-rapidapi-key": environment.key

    }) 
  	}; 
  	this.http.get<any>(`${URL}/submissions/${token}`,this.httpOptions).subscribe((dt:any) => {
  		if(dt.status.description === 'Processing' || dt.status.description === 'In Queue')
  			this.getSubmission(token);
      else
        this.emit(dt);
  		console.log(dt);
  	});
  }
  emit(result)
  {
    this.gotResult.next(result);
  }
}
