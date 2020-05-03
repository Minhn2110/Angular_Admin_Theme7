import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AdminService } from '../admin.service';
import { map, tap } from 'lodash';
import { catchError, switchMap } from 'rxjs/operators';
import { of, fromEvent } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../core/_base/crud';

@Component({
  selector: 'kt-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss']
})
export class AdminProductComponent implements OnInit {

  status: any;
  username: any;
  price: any;

  	/**
	 * Component constructor
	 *
	 * @param dialog: MatDialog
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param store: Store<AppState>
	 */
  constructor(public dialog: MatDialog, 
    private service: AdminService,
    private layoutUtilsService: LayoutUtilsService,
    ) {}

  ngOnInit() {
    this.status = '';
    // var day = new Date(2011, 9, 16);
    // var dayWrapper = moment(day).subtract(1, 'month').format("DD/MM/YYYY");
    // console.log('day', dayWrapper);
    this.initPagination();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.searchLogic();
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild(MatSort, {static: true}) sort: MatSort;





  // openDialog(): void {
  //   const dialogRef = this.dialog.open(UserCreateComponent, {
  //     width: '650px',
  //     height: '400px',
  //     data: {
  //       type: 'Create'
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     // this.service.createProductList().subscribe(response => {
  //     //   console.log(response);
  //     // });
  //     // console.log('The dialog was closed');
  //   });
  // }
  // edit(row): void {
  //   console.log('row', row);
  //   const dialogRef = this.dialog.open(UserCreateComponent, {
  //     width: '650px',
  //     height: '400px',
  //     data: {
  //       type: 'Edit',
  //       id: row.Id,
  //       name: row.Name,
  //       price: row.Price,
  //       quantity: row.InStock,
  //       status: row.Status,
  //       thumbnail: row.Thumbnail
  //     }
  //   });
  // }
  // delete(row): void {
  //   console.log('row', row);
  //   const dialogRef = this.dialog.open(UserCreateComponent, {
  //     width: '650px',
  //     height: '400px',
  //     data: {
  //       type: 'Delete',
  //       id: row.Id,
  //     }
  //   });
  // }

  column = [
    { columnDef: 'STT', header: '', cell: element => `` },
    { columnDef: 'name', header: 'Product Name', cell: element => `${element.Name}` },
    { columnDef: 'price', header: 'Price', cell: element => `${element.Price}` },
    { columnDef: 'InStock', header: 'Quantity', cell: element => `${element.InStock}` },
    { columnDef: 'CreateAt', header: 'Create At', cell: element => `${element.CreateAt}` },
    // { columnDef: 'UpdateAt', header: 'Update At', cell: element => `${element.UpdateAt}` },
    // { columnDef: 'DeleteAt', header: 'Delete At', cell: element => `${element.DeleteAt}` },
    { columnDef: 'status', header: 'Status', cell: element => `${element.Status == 1 ? 'Active' : 'Deactive'}`},
    { columnDef: 'actions', header: 'Actions', cell: element => ``},


  ]

  productList = [];
  selectedItems = [];
  length = 30;
  // Default page size

  selectOption: any;


  // New
  sortType = 'asc';
  sortBy = 'price';
  pageSize = 10;
  pageIndex = 0;

  displayedColumns = this.column.map(item => item.columnDef);
  filteredColumn = this.column.filter(item => {
    return item.columnDef !== 'STT' &&  item.columnDef !== 'actions'
  })

  dataSource = new MatTableDataSource();



  initPagination() {
    this.service.getProductList('', 'asc', 'price', 0, 10).subscribe(data =>  {
      console.log('data', data);
      this.handleData(data);
    });
  }
  handleData(data) {
      if(data.Products.length > 0) {
        console.log('aaa', data);
        this.dataSource = new MatTableDataSource(data.Products);
        this.length = data.TotalItems;
      }
  }
  changePageLogic(event) {
    console.log(event);
    this.pageSize = event.pageSize;
    this.service.getProductList('', this.sortType, this.sortBy ,event.pageIndex, event.pageSize).subscribe(data => {
      this.handleData(data);
    });
  }

  deleteProduct(_item: any) {
		const _title = 'Product Delete';
		const _description = 'Are you sure to permanently delete this product?';
		const _waitDesciption = 'Product is deleting...';
		const _deleteMessage = `Product has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			// this.store.dispatch(new OneProductDeleted({ id: _item.id }));
			// this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
		});
	}


  getData(pageIndex, pageSize, search, sortBy, order) {
    // const url = `https://api.github.com/users/geerlingguy/repos?per_page=${pageSize}&page=${pageIndex}`;
    // const url = `https://5dcb83d334d54a001431503b.mockapi.io/api/paging/book?page=${pageIndex}&limit=${pageSize}&search=${search}&sortBy=${sortBy}&order=${order}`;
    // const url = `https://api-demo-sem3.azurewebsites.net/api/Products?keyword&sortType=asc&sortBy=price&pageNumber=0&pageSize=10`;

    // ajax({
    //   url: url,
    //   method: 'GET',
    //   responseType: "json",
    // }).pipe(
    //   map(response => response),
    //   catchError(error => {
    //     console.log('error: ', error);
    //     return of(error);
    //   })
    // ).subscribe(item => {
    //   // debugger;
    //   this.productList = item;
    //   // this.length = this.getRandomInt(40);
    //   this.length = 40;


    //   console.log('data', item);
    //   // this.dataSource.sort = this.sort;
    //   // this.dataSource.paginator = this.paginator;
    // })
  }

  searchLogic() {
    // const keyup$ = fromEvent(this.searchInput.nativeElement, 'keyup');
    // keyup$.pipe(
    //   tap((i: any) => console.log('i', i.currentTarget.value)),
    //   // debounceTime(500),
    //   // distinctUntilChanged(),
    //   switchMap((i: any) => {
    //     const searchWord = i.currentTarget.value;
    //     return ajax({
    //       url: `https://api-demo-sem3.azurewebsites.net/api/Products?keyword=${searchWord}&sortType=${this.sortType}&sortBy=${this.sortBy}&pageNumber=${this.pageIndex}&pageSize=${this.pageSize}`,
    //       method: 'GET',
    //     }).pipe(catchError(err => of(err)));
    //   }),
    // )
    //   .subscribe((response) => {
    //     if (response) {
    //       console.log(response);
    //       this.resetDataSource(response.response.Products);
    //     }
    //   });
  }
  selectLogic() {
    console.log('select', this.selectOption);
    // Reset pageIndex in Material Table
    // this.service.getProductList('', 'asc', 'price',event.pageIndex, event.pageSize).subscribe(data => {
    //   if (data) {
    //     this.paginator.pageIndex = 0;
    //     this.handleData(data);
    //   }
    // });
    // this.getData(1, this.pageSize, this.selectOption, this.sortBy, this.order);
  }
  sortLogic(event) {
    this.service.getProductList('', event.direction, event.active, 0, this.pageSize).subscribe(data => {
      if (data) {
        this.paginator.pageIndex = 0;
        this.sortBy = event.active;
        this.sortType = event.direction;        
        this.handleData(data);
      }
    });
    console.log('sort', event);
  }
  resetDataSource(datasource) {
    this.paginator.pageIndex = 0;
    this.dataSource = new MatTableDataSource(datasource);
  }

}
