import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { DatePipe } from '@angular/common';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'aims-pos-daily-sale-report',
  templateUrl: './daily-sale-report.component.html',
  styleUrls: ['./daily-sale-report.component.scss'],
})
export class DailySaleReportComponent implements OnInit {
  // currentDate: any = '';
  startDate: any = '';
  endDate: any = '';
  reportList: any = [];
  discountList: any = [];
  lblTotalSale: any = '';
  lblTotalCost: any = '';
  lblTotalMargin: any;
  lblTotalDiscoount: any;
  lblGrandTotal: any = '';
  moduleId: string | null;

  // rptImg: any = 'assets/ui/ReportPictures/Logo.svg'
  constructor(
    private global: SharedServicesGlobalDataModule,
    private globalService: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    // this.currentDate = new Date();
    this.moduleId = localStorage.getItem('moduleId');
  }
  getDailySale(start: any, end: any) {
    if (start == '') {
      // console.log('enter start date');
      this.valid.apiInfoResponse('enter start date');
    }

    // debugger;
    if (start !== '' && end !== '') {
      var startdate, enddate;
      startdate = this.datePipe.transform(start, 'yyyy-MM-dd');
      enddate = this.datePipe.transform(end, 'yyyy-MM-dd');
      this.dataService
        .getHttp(
          'report-api/FMISReport/getDailySales?startDate=' +
            startdate +
            '&endDate=' +
            enddate +
            '&userID=' +
            this.globalService.getUserId() +
            '&moduleId=' +
            this.moduleId +
            '&branchID=' +
            this.globalService.getBranchID(),
          ''
        )
        .subscribe(
          (response: any) => {
            // this.deductionList = response;
            this.reportList = response;
            const sale = this.reportList.reduce((sum: any, total: any) => {
              return sum + total.salePrice;
            }, 0);
            this.lblTotalSale = sale;

            const cost = this.reportList.reduce((sum: any, total: any) => {
              return sum + total.costPrice;
            }, 0);
            this.lblTotalCost = cost;

            var margin: any = this.reportList.reduce((sum: any, total: any) => {
              return sum + total.margin;
            }, 0);
            this.lblTotalMargin = margin;
            // const disc = this.reportList.reduce((sum: any, total: any) => {
            //   return sum + total.discount;
            // }, 0);
            // this.lblTotalDiscoount = disc;
            // console.log(this.lblTotalSale);
          },
          (error: any) => {
            console.log(error);
          }
        );
    }
  }
  getDailyInvoice(start: any, end: any) {
    if (start == '') {
      // console.log('enter start date');
      this.valid.apiInfoResponse('enter start date');
    }

    // debugger;
    if (start !== '' && end !== '') {
      var startdate, enddate;
      startdate = this.datePipe.transform(start, 'yyyy-MM-dd');
      enddate = this.datePipe.transform(end, 'yyyy-MM-dd');
      this.dataService
        .getHttp(
          'report-api/FMISReport/getDailySalesByOrder?startDate=' +
            startdate +
            '&endDate=' +
            enddate +
            '&userID=' +
            this.globalService.getUserId() +
            '&moduleId=' +
            this.moduleId +
            '&branchID=' +
            this.globalService.getBranchID(),
          ''
        )
        .subscribe(
          (response: any) => {
            this.discountList = response;
            var disc: any;
            disc = this.discountList.reduce((sum: any, total: any) => {
              return sum + total.discount;
            }, 0);
            this.lblTotalDiscoount = disc;
            this.lblGrandTotal = parseInt(
              (this.lblTotalMargin - this.lblTotalDiscoount).toString()
            );
          },
          (error: any) => {
            console.log(error);
          }
        );
    }
  }
}
