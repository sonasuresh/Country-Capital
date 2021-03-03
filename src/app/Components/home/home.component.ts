import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import * as data from '../../../assets/data.json'
import { DialogComponent } from '../dialog/dialog.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';

export interface Element {
  country: string;
  city: string;

}
export interface CountryCapitalData {
  country: string;
  city: any;

}
const DATA: Element[] = [
  { country: '-', city: '-' },
];

const countryData: CountryCapitalData[] = (data as any).default;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  columnName: string = '';
  myControl = new FormControl();
  options: any = [];
  data = Object.assign(DATA);
  dataSource = new MatTableDataSource<Element>(this.data);
  matMenuTrigger: any;
  country: string[] = [];
  city: string[] = [];
  newrowFlag: Boolean = false
  editingState = {
    row: -1,
    column: -1
  }
  menuState = {
    row: -1,
    column: -1
  }

  @ViewChild(MatPaginator)
  paginator: MatPaginator | any;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger | any;
  @ViewChild(ToastContainerDirective, { static: true })
  toastContainer: ToastContainerDirective | any;
  constructor(public dialog: MatDialog, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  displayedColumns: string[] = ['S.No', 'Country', 'City', 'Actions'];
  deleteItem(i: number, country: string, capital: string) {
    var index = -1;
    this.data.find(function (item: any, i: number) {
      if (item.country === country) {

        index = i;
      }
    })

    if (this.data.length == 1) {
      this.toastr.error('Cant Delete Last Item!', '', { timeOut: 2000 });
    } else {
      this.data.splice(index, 1)
      this.dataSource = new MatTableDataSource<Element>(this.data);
      this.dataSource.paginator = this.paginator;
      this.toastr.success('Deleted Successfully!', '', { timeOut: 1000 });
    }
  }

  onEdit(row: number, key: string) {
    const index = this.displayedColumns.findIndex(col => col === key);

    this.editingState = {
      row, column: index
    }
  }
  onBlurEvent() {
    this.editingState = {
      row: -1, column: -1
    }
  }
  searchData(value: string, key: 'city' | 'country') {
    this.options = (countryData.filter((c) => c[key] !== null && c[key].includes(value)))
    return countryData.filter((c) => c[key] !== null && c[key].includes(value))
  }
  setData(data: string, position: number, key: string) {
    let countryCapitalData: any = []
    if (key == 'country') {

      countryCapitalData = this.searchData(data, 'country')
    }
    else if (key == 'city') {

      countryCapitalData = this.searchData(data, 'city')
    }
    const newData = [...this.data]
    newData[position].city = countryCapitalData[0].city
    newData[position].country = countryCapitalData[0].country
    this.data = newData
    this.dataSource = new MatTableDataSource<Element>(newData);
    this.editingState = {
      row: -1, column: -1
    }
    this.country[position] = ""
    this.city[position] = ""
  }
  addRow(key: string) {
    let index = this.menuState.row
    if (key == 'below') {
      index = index + 1
    }
    let json: any = {}
    this.displayedColumns.forEach((ele) => { if (ele != 'S.No' && ele != 'Actions') { { json[ele.toLowerCase()] = '-' } } })

    DATA.splice(index, 0, json);
    this.data = Object.assign(DATA);
    this.dataSource = new MatTableDataSource<Element>(this.data);
    this.dataSource.paginator = this.paginator;
  }
  openDialog(position: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: { columnName: this.columnName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.columnName != '') {
        let index = this.menuState.column

        if (position == 'right') {
          index = index + 1
        }
        this.displayedColumns.splice(index, 0, result.columnName);
        const newData = [...this.data]

        const key = result.columnName


        newData.forEach((ele) => { ele[key] = "-" })
        this.data = newData
        this.dataSource = new MatTableDataSource<Element>(newData);
      }
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  contextMenuPosition = { x: '0px', y: '0px' };

  onContextMenu(event: MouseEvent, row: number, column: number) {
    console.log(row, column)
    this.menuState = {
      row, column
    }
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  getActionIndexValue() {
    return this.displayedColumns.findIndex(col => col === 'Actions');

  }
  deleteColumn(colIndex:number){
    this.displayedColumns.splice(colIndex, 1);
  }
}


