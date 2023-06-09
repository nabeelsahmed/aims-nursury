import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { MyFormField, SaleInterface } from '@aims-pos/shared/interface';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PrintSaleComponent } from './print-sale/print-sale.component';
import { ProductSaleTableComponent } from './product-sale-table/product-sale-table.component';

declare var $: any;

@Component({
  selector: 'aims-pos-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss'],
})
export class SaleComponent implements OnInit {
  @ViewChild(ProductSaleTableComponent) productSaleTable: any;
  @ViewChild(PrintSaleComponent) printSale: any;

  @ViewChild('txtCash') _txtCash: ElementRef;
  @ViewChild('txtFocusCode') _txtFocusCode: ElementRef;

  roleID: any = 0;

  searchProduct: any = '';
  cmbProduct: any = '';
  txtCode: any = '';
  lblTotal: any = 0;
  lblCash: any = 0;
  lblInvoiceNo: any = 0;
  percentage: number = 0;

  pageFields: SaleInterface = {
    invoiceNo: '0', //0
    userID: '', //1
    invoiceDate: '', //2
    partyID: '0', //3
    refInvoiceNo: '0', //4
    refInvoiceDate: '', //5
    discount: '0', //6
    cashReceived: '0', //7
    change: '0', //8
    description: '', //9
    json: '', //10
    companyid: '', //11
    businessid: '', //12
    branchid: '', //13
    moduleId: '',
  };

  formFields: MyFormField[] = [
    {
      value: this.pageFields.invoiceNo,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.userID,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.invoiceDate,
      msg: '',
      type: 'date',
      required: false,
    },
    {
      value: this.pageFields.partyID,
      msg: '',
      type: 'selectBox',
      required: false,
    },
    {
      value: this.pageFields.refInvoiceNo,
      msg: '',
      type: '',
      required: false,
    },
    {
      value: this.pageFields.refInvoiceDate,
      msg: '',
      type: '',
      required: false,
    },
    {
      value: this.pageFields.discount,
      msg: '',
      type: 'textBox',
      required: false,
    },
    {
      value: this.pageFields.cashReceived,
      msg: '',
      type: 'textBox',
      required: false,
    },
    {
      value: this.pageFields.change,
      msg: '',
      type: 'textBox',
      required: false,
    },
    {
      value: this.pageFields.description,
      msg: '',
      type: 'textBox',
      required: false,
    },
    {
      value: this.pageFields.json,
      msg: 'enter products',
      type: 'textBox',
      required: true,
    },
    {
      value: this.pageFields.companyid,
      msg: '',
      type: '',
      required: false,
    },
    {
      value: this.pageFields.businessid,
      msg: '',
      type: '',
      required: false,
    },
    {
      value: this.pageFields.branchid,
      msg: '',
      type: '',
      required: false,
    },
    {
      value: this.pageFields.moduleId,
      msg: '',
      type: 'hidden',
      required: false,
    },
  ];

  error: any;

  companyList: any = [];
  businessList: any = [];
  branchList: any = [];
  productList: any = [];
  partyList: any = [];
  moduleId: string | null;
  constructor(
    private dataService: SharedServicesDataModule,
    private globalService: SharedServicesGlobalDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    this.moduleId = localStorage.getItem('moduleId');
    this.formFields[14].value = localStorage.getItem('moduleId');
    // this.globalService.setHeaderTitle("Sale");
    this.formFields[1].value = this.globalService.getUserId().toString();

    this.roleID = this.globalService.getRoleId();
    this.getCompany();
    this.getProduct();
    this.getParty();
  }

  getCompany() {
    this.dataService.getHttp('cmis-api/Company/getCompany', '').subscribe(
      (response: any) => {
        this.companyList = response;
        if (this.globalService.getRoleId() != 1) {
          this.getBusiness();
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getBusiness() {
    var companyID = 0;
    if (this.globalService.getRoleId() == 1) {
      companyID = this.formFields[11].value;
    } else {
      companyID = this.globalService.getCompanyID();
    }
    this.dataService
      .getHttp('cmis-api/Business/getBusiness?companyID=' + companyID, '')
      .subscribe(
        (response: any) => {
          this.businessList = response;
          if (this.globalService.getRoleId() != 1) {
            this.formFields[11].value = this.globalService.getCompanyID();
            this.formFields[12].value = this.globalService.getBusinessID();
            this.getBranch();
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getBranch() {
    var businessID = 0;
    if (this.globalService.getRoleId() == 1) {
      businessID = this.formFields[12].value;
    } else {
      businessID = this.globalService.getBusinessID();
      if (this.formFields[12].value == '') {
        this.formFields[12].value = this.globalService.getBusinessID();
      }
    }

    this.dataService
      .getHttp('cmis-api/Branch/getBranch?businessID=' + businessID, '')
      .subscribe(
        (response: any) => {
          this.branchList = response;
          if (this.globalService.getRoleId() != 1) {
            this.formFields[13].value = this.globalService.getBranchID();
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getProduct() {
    this.dataService
      .getHttp(
        'core-api/Product/getProduct?companyID=' +
          this.globalService.getCompanyID() +
          '&branchID=' +
          this.globalService.getBranchID() +
          '&userID=' +
          this.globalService.getUserId() +
          '&moduleId=' +
          this.moduleId,
        ''
      )
      .subscribe(
        (response: any) => {
          this.productList = response;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }
  getParty() {
    this.dataService
      .getHttp(
        'core-api/Party/getAllCustomer?userID=' +
          this.globalService.getUserId() +
          '&moduleId=' +
          this.moduleId +
          '&branchID=' +
          this.globalService.getBranchID(),
        ''
      )
      .subscribe(
        (response: any) => {
          // this.bpsTable.tableData = response;
          this.partyList = response;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }
  // getParty() {
  //   this.dataService
  //     .getHttp(
  //       'core-api/Party/getParty?companyID=' +
  //         this.globalService.getCompanyID() +
  //         '&businessID=' +
  //         this.globalService.getBusinessID(),
  //       ''
  //     )
  //     .subscribe(
  //       (response: any) => {
  //         this.partyList = response;
  //       },
  //       (error: any) => {
  //         console.log(error);
  //       }
  //     );
  // }

  pushProductByCode(item: any, e: any) {
    if (e.ctrlKey == true) {
      //   // alert(e.keyCode);
      this._txtCash.nativeElement.focus();
      this.formFields[7].value = '';
      this.txtCode = '';
    }
    if (e.keyCode == 13) {
      return;
    }

    var data = this.productList.filter(
      (x: { barcode1: any; barcode2: any; barcode3: any }) =>
        x.barcode1 == item.toString() &&
        (x.barcode2 == '' || x.barcode2 == null) &&
        (x.barcode3 == '' || x.barcode3 == null)
    );

    if (data.length == 0 && item.toString() != '') {
      data = this.productList.filter(
        (x: { barcode1: any; barcode2: any; barcode3: any }) =>
          x.barcode2 == item.toString() &&
          (x.barcode3 == '' || x.barcode3 == null)
      );

      if (data.length == 0 && item.toString() != '') {
        var data = this.productList.filter(
          (x: { barcode1: any; barcode2: any; barcode3: any }) =>
            x.barcode3 == item.toString()
        );

        if (data.length == 0) {
          return;
        }
      }
    }
    if (this.productSaleTable.tableData.length == 0) {
      this.productSaleTable.tableData.push({
        barcode1: data[0].barcode1,
        barcode2: data[0].barcode2,
        barcode3: data[0].barcode3,
        productID: data[0].productID,
        productName: data[0].productName,
        qty: 1,
        costPrice: data[0].costPrice,
        salePrice: data[0].salePrice,
        locationID: data[0].locationID,
        total: data[0].salePrice,
        packing: data[0].packing,
        packingSalePrice: data[0].packingSalePrice,
        status: '',
      });
    } else {
      var found = false;
      var index = 0;
      for (var i = 0; i < this.productSaleTable.tableData.length; i++) {
        if (
          this.productSaleTable.tableData[i].barcode1 == item ||
          this.productSaleTable.tableData[i].barcode2 == item ||
          this.productSaleTable.tableData[i].barcode3 == item
        ) {
          found = true;
          index = i;
          i = this.productSaleTable.tableData.length + 1;
        }
      }
      if (found == true) {
        if (this.productSaleTable.tableData[index].status == 'deleted') {
          this.productSaleTable.tableData[index].status = '';
        } else {
          this.productSaleTable.tableData[index].qty += 1;
          this.productSaleTable.tableData[index].total =
            this.productSaleTable.tableData[index].salePrice *
            this.productSaleTable.tableData[index].qty;
        }
      } else {
        this.productSaleTable.tableData.push({
          barcode1: data[0].barcode1,
          barcode2: data[0].barcode2,
          barcode3: data[0].barcode3,
          productID: data[0].productID,
          productName: data[0].productName,
          qty: 1,
          costPrice: data[0].costPrice,
          salePrice: data[0].salePrice,
          locationID: data[0].locationID,
          total: data[0].salePrice,
          packing: data[0].packing,
          packingSalePrice: data[0].packingSalePrice,
          status: '',
        });
      }
    }

    this.lblTotal = 0;
    for (var i = 0; i < this.productSaleTable.tableData.length; i++) {
      this.lblTotal += this.productSaleTable.tableData[i].total;
    }

    this.formFields[8].value = -this.lblTotal;
    this.txtCode = '';
  }

  pushProduct(item: any) {
    var data = this.productList.filter(
      (x: { productID: any }) => x.productID == item
    );

    if (this.productSaleTable.tableData.length == 0) {
      this.productSaleTable.tableData.push({
        barcode1: data[0].barcode1,
        barcode2: data[0].barcode2,
        barcode3: data[0].barcode3,
        productID: data[0].productID,
        productName: data[0].productName,
        qty: 1,
        costPrice: data[0].costPrice,
        salePrice: data[0].salePrice,
        locationID: data[0].locationID,
        total: data[0].salePrice,
        packing: data[0].packing,
        packingSalePrice: data[0].packingSalePrice,
        status: '',
      });
    } else {
      var found = false;
      var index = 0;
      for (var i = 0; i < this.productSaleTable.tableData.length; i++) {
        if (this.productSaleTable.tableData[i].productID == item) {
          found = true;
          index = i;
          i = this.productSaleTable.tableData.length + 1;
        }
      }

      if (found == true) {
        if (this.productSaleTable.tableData[index].status == 'deleted') {
          this.productSaleTable.tableData[index].status = '';
        } else {
          this.productSaleTable.tableData[index].qty += 1;
          this.productSaleTable.tableData[index].total =
            this.productSaleTable.tableData[index].salePrice *
            this.productSaleTable.tableData[index].qty;
        }
      } else {
        this.productSaleTable.tableData.push({
          barcode1: data[0].barcode1,
          barcode2: data[0].barcode2,
          barcode3: data[0].barcode3,
          productID: data[0].productID,
          productName: data[0].productName,
          qty: 1,
          costPrice: data[0].costPrice,
          salePrice: data[0].salePrice,
          locationID: data[0].locationID,
          total: data[0].salePrice,
          packing: data[0].packing,
          packingSalePrice: data[0].packingSalePrice,
          status: '',
        });
      }
    }

    this.lblTotal = 0;
    for (var i = 0; i < this.productSaleTable.tableData.length; i++) {
      this.lblTotal += this.productSaleTable.tableData[i].total;
    }

    this.formFields[8].value = -this.lblTotal;
  }

  totalBill() {
    this.lblTotal = 0;
    for (var i = 0; i < this.productSaleTable.tableData.length; i++) {
      if (this.productSaleTable.tableData[i].status != 'deleted')
        this.lblTotal += this.productSaleTable.tableData[i].total;
    }

    this.formFields[8].value = -this.lblTotal;
  }

  changeValue() {
    if (this.formFields[8].value == '') {
      this.formFields[8].value = 0;
    }
    if (this.formFields[6].value == '') {
      this.formFields[6].value = 0;
    }
    // if(this.formFields[7].value == ''){
    //   this.formFields[7].value = 0;
    // }
    if (this.formFields[7].value == '' || this.formFields[7].value == null) {
      this.valid.apiInfoResponse('enter cash');
      this.formFields[8].value = 0 - this.lblTotal;
      return;
    }
    // if (this.percentage > 0) {
    //   this.formFields[6].value = Math.round(
    //     this.lblTotal * (this.percentage / 100)
    //   );
    // }
    this.formFields[8].value =
      parseInt(this.formFields[6].value) +
      parseInt(this.formFields[7].value) -
      this.lblTotal;
  }

  save(printSection: string) {
    var date = new Date();

    // return;

    this.lblCash = this.formFields[7].value;

    this.formFields[2].value = new Date();

    var prodTableData: any = [];

    for (var i = 0; i < this.productSaleTable.tableData.length; i++) {
      if (this.productSaleTable.tableData[i].status != 'deleted') {
        prodTableData.push({
          productID: this.productSaleTable.tableData[i].productID,
          productName: this.productSaleTable.tableData[i].productName,
          qty: this.productSaleTable.tableData[i].qty,
          costPrice: this.productSaleTable.tableData[i].costPrice,
          salePrice: this.productSaleTable.tableData[i].salePrice,
          locationID: this.productSaleTable.tableData[i].locationID,
          total: this.productSaleTable.tableData[i].salePrice,
          status: '',
        });
      }
    }
    this.formFields[10].value = JSON.stringify(prodTableData);

    if (prodTableData.length == 0) {
      this.valid.apiInfoResponse('enter products');
      return;
    }

    if (this.formFields[7].value == '' || this.formFields[7].value == null) {
      this.valid.apiInfoResponse('enter cash');
      // this.formFields[8].value = 0 - this.lblTotal;
      return;
    }
    if (
      (this.formFields[3].value == '' || this.formFields[3].value == '0') &&
      this.formFields[7].value == 0
    ) {
      this.valid.apiInfoResponse('enter cash');
      return;
    }
    if (this.formFields[3].value == '') {
      var cash =
        parseInt(this.formFields[6].value) + parseInt(this.formFields[7].value);
      if (this.lblTotal > cash) {
        this.valid.apiInfoResponse('enter correct cash');
        return;
      }
    }

    if (this.lblTotal < parseInt(this.formFields[6].value)) {
      this.formFields[6].value =
        parseInt(this.formFields[6].value) - parseInt(this.formFields[8].value);
    }

    this.dataService
      .savetHttp(this.pageFields, this.formFields, 'core-api/Sale/saveSales')
      .subscribe(
        (response: any) => {
          // console.log(response);
          if (response.message == 'Success') {
            this.valid.apiInfoResponse('Record saved successfully');

            this.printSale.tableData = prodTableData;

            this.printSale.lblInvoice = response.invoiceNo;
            this.printSale.lblDate = date;
            this.printSale.lblGTotal = this.lblTotal;
            this.printSale.lblDiscount = this.formFields[6].value;
            this.printSale.lblCash = this.lblCash;
            this.printSale.lblChange = this.formFields[8].value;

            setTimeout(() => this.globalService.printData(printSection), 200);
            this.reset();
            setTimeout(() => this._txtFocusCode.nativeElement.focus(), 1000);
          } else {
            this.valid.apiErrorResponse(response.toString());
          }
        },
        (error: any) => {
          this.error = error;
          this.valid.apiErrorResponse(this.error);
        }
      );
  }

  checkSaleReturn() {
    if (this.productSaleTable.tableData.length == 0) {
      this.valid.apiInfoResponse('enter products');
      return;
    }

    $('#saleReturnModal').modal('show');
  }

  saleReturn() {
    this.dataService
      .getHttp(
        'core-api/Sale/getSaleReturn?invoiceNo=' +
          this.lblInvoiceNo +
          '&userID=' +
          this.globalService.getUserId() +
          '&moduleId=' +
          this.moduleId +
          '&branchId=' +
          this.globalService.getBranchID(),
        ''
      )
      .subscribe(
        (response: any) => {
          if (response.length == 0) {
            this.valid.apiInfoResponse('no invoice found');
            return;
          } else {
            let result = this.productSaleTable.tableData.filter(
              (r1: { productID: any; qty: any }) =>
                response.some(
                  (r2: { productID: any; qty: any }) =>
                    r1.productID === r2.productID && r1.qty <= r2.qty
                )
            );

            if (this.productSaleTable.tableData.length == result.length) {
              this.lblCash = this.formFields[7].value;

              this.formFields[4].value = this.lblInvoiceNo;
              this.formFields[5].value = new Date();

              this.formFields[10].value = JSON.stringify(
                this.productSaleTable.tableData
              );

              this.dataService
                .savetHttp(
                  this.pageFields,
                  this.formFields,
                  'core-api/Sale/saveSaleReturn?userID=' +
                    this.globalService.getUserId() +
                    '&moduleId=' +
                    this.moduleId
                )
                .subscribe(
                  (response: any) => {
                    // console.log(response);
                    if (response.message == 'Success') {
                      this.valid.apiInfoResponse('Record saved successfully');

                      this.reset();
                    } else {
                      this.valid.apiErrorResponse(response.toString());
                    }
                  },
                  (error: any) => {
                    this.error = error;
                    this.valid.apiErrorResponse(this.error);
                  }
                );
            } else {
              this.valid.apiErrorResponse('product not found in sale invoice');
              return;
            }
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  reset() {
    this.formFields = this.valid.resetFormFields(this.formFields);

    this.formFields[0].value = '0';
    this.formFields[2].value = '';
    this.formFields[3].value = '0';
    this.formFields[4].value = '0';
    this.formFields[5].value = '';
    this.formFields[6].value = '0';
    this.formFields[7].value = '0';
    this.formFields[8].value = '0';
    this.formFields[9].value = '';

    this.lblInvoiceNo = 0;
    this.searchProduct = '';
    this.cmbProduct = '';
    this.lblTotal = 0;
    this.lblCash = 0;
    this.productSaleTable.tableData = [];
    this.txtCode = '';

    $('#saleReturnModal').modal('hide');
  }

  getKeyPressed(e: any, printSection: string) {
    if (e.keyCode == 13) {
      this.save(printSection);
    }
  }
  calculateTotalAmount(item: any) {
    if (item == 1) {
      this.formFields[6].value = Math.round(
        this.lblTotal * (this.percentage / 100)
      );
      this.formFields[8].value =
        parseInt(this.formFields[6].value) +
        parseInt(this.formFields[7].value) -
        this.lblTotal;
    }
    if (item == 2) {
      this.percentage = (this.formFields[6].value * 100) / this.lblTotal;
      this.percentage.toFixed(2);
      this.formFields[8].value =
        parseInt(this.formFields[6].value) +
        parseInt(this.formFields[7].value) -
        this.lblTotal;
    }
  }
}
