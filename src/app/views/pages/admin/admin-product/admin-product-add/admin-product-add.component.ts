import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { startWith, finalize } from 'rxjs/operators';
import { map } from 'lodash';
import { Observable } from 'rxjs';
import { AngularFireStorage } from "@angular/fire/storage";

@Component({
  selector: 'kt-admin-product-add',
  templateUrl: './admin-product-add.component.html',
  styleUrls: ['./admin-product-add.component.scss']
})

export class AdminProductAddComponent implements OnInit {
  productForm: FormGroup;


  constructor(
    private productFB: FormBuilder,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.productForm = this.productFB.group({
      name: [''],
      manufacture: [''],
      type: [''],
      color: [''],
      price: [''],
      status: [''],
      description: ['']
    });

  }

  onSumbit(withBack: boolean = false) {
    // this.hasFormErrors = false;
    /** check form */
    // if (this.productForm.invalid) {
    // 	Object.keys(controls).forEach(controlName =>
    // 		controls[controlName].markAsTouched()
    // 	);

    // 	this.hasFormErrors = true;
    // 	this.selectedTab = 0;
    // 	return;
    // }

    // // tslint:disable-next-line:prefer-const
    let editedProduct = this.prepareProduct();
    console.log(editedProduct);

    // if (editedProduct.id > 0) {
    // 	this.updateProduct(editedProduct, withBack);
    // 	return;
    // }

    // this.addProduct(editedProduct, withBack);
  }

  prepareProduct() {
    const controls = this.productForm.controls;
    console.log(controls);
    const form = {
      name: controls.name.value
    }

    const filePath = `ProjectImage/${this.n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`ProjectImage/${this.n}`, this.file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
            }
            console.log('link', this.fb);
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log('url', url);
        }
      });
    return form
  }
  urls = [];
  title = "cloudsSorage";
  selectedFile: File = null;
  fb;
  downloadURL: Observable<string>;

  n: any;
  file: File;

  onFileSelected(event) {
    this.n = Date.now();
    this.file = event.target.files[0];
    // if (event.target.files && event.target.files[0]) {
    //   var filesAmount = event.target.files.length;
    //   for (let i = 0; i < filesAmount; i++) {
    //     var reader = new FileReader();

    //     reader.onload = (event: any) => {
    //       console.log(event.target.result);
    //       this.urls.push(event.target.result);
    //     }

    //     reader.readAsDataURL(event.target.files[i]);
    //   }
    // }
    console.log(this.urls);
  }

}
