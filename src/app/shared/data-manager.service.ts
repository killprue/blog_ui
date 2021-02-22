import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, ObservableLike } from 'rxjs';
import { Post } from './post.model';
import { HowTo } from './howto.model';
import { HomeInfo } from './home-info.model';
import { Email } from './emails.model';


@Injectable({
    providedIn: 'root'
})

export class DataManageService {

    // private readonly rootPath: string = 'https://rvawol.appspot.com/admin/';
    private readonly rootPath: string = 'http://localhost:5000/admin/';

    constructor(private http: HttpClient) { }

    public getAllPosts(): Observable<Post[]> {
        return this.http.get<Post[]>(this.rootPath + 'all-posts');
    }

    public getAllHowTos(): Observable<HowTo[]> {
        return this.http.get<HowTo[]>(this.rootPath + 'how-tos');
    }
    public createBlogPost(load): Observable<any> {
        return this.http.post(this.rootPath + 'create-post', load);
    }

    public createHowTo(load): Observable<any> {
        return this.http.post(this.rootPath + 'create-how-to', load);
    }

    public getToken(load): Observable<any> {
        return this.http.post(this.rootPath + 'authenticate', load)
    }

    public getSinglePost(id: string): Observable<Post> {
        return this.http.get<Post>(this.rootPath + 'single-post/' + id)
    }

    public getSingleHowTo(id: string): Observable<HowTo> {
        return this.http.get<HowTo>(this.rootPath + 'single-how-to/' + id)
    }

    public deletePost(id: string): Observable<any> {
        return this.http.delete(this.rootPath + 'delete-post/' + id);
    }

    public deleteHowTo(id: string): Observable<any> {
        return this.http.delete(this.rootPath + 'delete-how-to/' + id);
    }

    public editPost(load): Observable<any> {
        return this.http.put<Post>(this.rootPath + 'update-post', load);
    }

    public editHowTo(load): Observable<any> {
        return this.http.put<HowTo>(this.rootPath + 'update-how-to', load);
    }

    public addPostImages(load): Observable<any> {
        return this.http.post(this.rootPath + 'add-post-images', load);
    }

    public addHowToImages(load): Observable<any> {
        return this.http.post(this.rootPath + 'add-howto-images', load);
    }

    public removePostImage(load): Observable<any> {
        return this.http.post(this.rootPath + 'remove-post-image', load);
    }

    public removeHowToImage(load): Observable<any> {
        return this.http.post(this.rootPath + 'remove-howto-image', load);
    }

    public sendEmail(load): Observable<any> {
        return this.http.post(this.rootPath + 'send-email', load);
    }

    public editHomePage(load): Observable<any> {
        return this.http.post(this.rootPath + 'edit-home-page', load);
    }

    public addHomePageImage(load): Observable<any> {
        return this.http.post(this.rootPath + 'add-home-page-image', load);
    }

    public removeHomePageImage(load): Observable<any> {
        return this.http.post(this.rootPath + 'remove-home-page-image', load);
    }

    public getHomePage(): Observable<any> {
        return this.http.get<HomeInfo>(this.rootPath + 'get-home-page');
    }

    public getAllEmails(): Observable<any> {
        return this.http.get<Email[]>(this.rootPath + 'get-all-emails');
    }
}
