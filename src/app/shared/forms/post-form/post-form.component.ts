import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PostService} from "../../../services/post.service";
import {IPost} from "../../../model/IPost";
import {Router} from "@angular/router";

declare let $: any;


@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html'
})
export class PostFormComponent implements OnInit, AfterViewInit {

  private post: any = {

  };

  private isEditingPost: boolean = false;


  @ViewChild('component')
  private component: ElementRef;

  private modal: any = null;



  constructor(
    private postService: PostService,
    private router: Router) {}

  private init(): void {
    this.post = {
      id: -1,
      title: '',
      body: '',
      image: '',
      tags: [],
      tag: ''
    };

    this.isEditingPost = false;
  }

  public ngOnInit() {
    this.init();

    this.postService.modalOpened$.subscribe(
      post => {

        if(post == null) {
          this.init();
          return;
        }


        this.isEditingPost = true;

        this.post.id = post.id;
        this.post.title = post.title;
        this.post.body = post.body;
        //this.post.image
        this.post.tags = [];

        for(let t of post.tags) {
          this.post.tags.push(t['name']);
        }

        this.modal.open();
      }
    )
  }

  private addTag($event): void {
    this.post.tags.push(this.post.tag.toLowerCase().replace(/^\s+|\s+$/g, ''));
    this.post.tag = '';
  }

  private removeTag($event):void {
    let clickedTag = $event.currentTarget.innerHTML;
    this.removeFromArray(this.post.tags, clickedTag);
  }

  private fileSelected(image) {
    if(image) {
      this.post.image = image.name;
    } else {
      this.post.image = "";
    }
  }

  private removeImg(): any {
    this.post.image = "";
  }

  private removeFromArray(array, item): void {
    let index = array.indexOf(item);
    if (index > -1) {
      array.splice(index, 1);
    }
  }

  private submitPost(): void {
    delete this.post.tag;

    if(this.isEditingPost) {

      this.postService.updatePost(this.post).subscribe (
        (post: IPost) => {
          this.post = post;
          this.isEditingPost = false;
        }
      );

    } else {

      delete this.post.id;

      this.postService.createPost(this.post).subscribe (
        () => this.router.navigate(['discover'])
      );

    }

    this.modal.close();
  }

  public ngAfterViewInit() {
    if(this.modal == null) {
      this.modal = $(this.component.nativeElement).remodal();
    }
  }


  // TODO: Remove this when we're done
  get diagnostic() {
    return JSON.stringify(this.post);
  }

}
