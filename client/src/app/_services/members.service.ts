import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';


@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl=environment.apiUrl;
  members:Member[]=[];
  memberCache= new Map();
  user:User;
  userParams:UserParams;
  

  constructor(private http: HttpClient, private accountService:AccountService) {
    this.accountService.currentUsers$.pipe(take(1)).subscribe(user=>{
      this.user=user;
      this.userParams=new UserParams(user);
    })
   }

   getUserParams(){
    return this.userParams;
   }

   setUSerParams(params:UserParams){
    this.userParams=params;
   }


   restUserParams(){
    this.userParams=new UserParams(this.user);
    return this.userParams;
  }

  getMembers(userParams: UserParams) {
    var response = this.memberCache.get(Object.values(userParams).join('-'));
    if (response) {
      return of(response);
    }

    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

      params=params.append('minAge', userParams.minAge.toString());
      params=params.append('maxAge', userParams.maxAge.toString());
      params=params.append('gender', userParams.gender);
      params=params.append('orderBy', userParams.orderBy);
    return getPaginatedResult<Member[]>(this.baseUrl + 'users', params, this.http)
    .pipe(map(response=>{
      this.memberCache.set(Object.values(userParams).join('-'), response);
      return response;
    }))
  }

 

  getMember(userName:string){
    const member = [...this.memberCache.values()]
      .reduce((arr,elem)=>arr.concat(elem.result),[])
      .find((member:Member)=> member.username===userName);
      if(member){
        return of(member);
      }
      console.log(userName + "Suresh 3");
    return this.http.get<Member>(this.baseUrl + 'users/' + userName);
  }

  updateMember(member:Member){
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(()=>{
        const index = this.members.indexOf(member);
        this.members[index]=member;
      })
    )
  }
  setMainPhoto(PhotoId:number){
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + PhotoId, {});
  }

  deletePhoto(PhotoId:number){
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + PhotoId)
  }


  addLike(username:string){
    return this.http.post(this.baseUrl + 'likes/' + username, {})
  }

  getLikes(predicate:string, pageNumber, pageSize){
    let params = getPaginationHeaders(pageNumber, pageSize);
    params=params.append('predicate', predicate);
    return getPaginatedResult<Partial<Member[]>>(this.baseUrl + 'likes', params, this.http);
  }

  
}