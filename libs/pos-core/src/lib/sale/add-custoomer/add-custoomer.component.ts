import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { MyFormField, NewSalePartyInterface } from '@aims-pos/shared/interface';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'aims-pos-add-custoomer',
  templateUrl: './add-custoomer.component.html',
  styleUrls: ['./add-custoomer.component.scss'],
})
export class AddCustoomerComponent implements OnInit {
  @Output() eventEmitter = new EventEmitter();
  constructor(
    private dataService: SharedServicesDataModule,
    private globalService: SharedServicesGlobalDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  cnicMask = this.globalService.cnicMask();
  mobileMask = this.globalService.mobileMask();
  pageFields: NewSalePartyInterface = {
    partyID: '0',
    userID: '',
    partyName: '',
    cnic: '',
    mobile: '',
    moduleId: '', //5
  };

  formFields: MyFormField[] = [
    {
      value: this.pageFields.partyID,
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
      value: this.pageFields.partyName,
      msg: 'enter party name',
      type: 'textbox',
      required: true,
    },
    {
      value: this.pageFields.cnic,
      msg: 'enter cnic',
      type: 'cnic',
      required: true,
    },
    {
      value: this.pageFields.mobile,
      msg: 'enter mobile',
      type: 'mobile',
      required: true,
    },
    {
      value: this.pageFields.moduleId,
      msg: '',
      type: 'hidden',
      required: false,
    },
  ];

  error: any;
  ngOnInit(): void {
    this.formFields[1].value = this.globalService.getUserId().toString();
    this.formFields[5].value = localStorage.getItem('moduleId');
  }
  save() {
    this.dataService
      .savetHttp(
        this.pageFields,
        this.formFields,
        'core-api/Party/saveCustomerSale'
      )
      .subscribe(
        (response: any[]) => {
          if (response[0].includes('Success') == true) {
            console.log(response);
            if (this.formFields[0].value > 0) {
              this.valid.apiInfoResponse(' updated successfully');
            } else {
              this.valid.apiInfoResponse(' created successfully');
            }
            this.eventEmitter.emit();
            this.reset();
          } else {
            this.valid.apiErrorResponse(response[0]);
          }
        },
        (error: any) => {
          this.error = error;
          this.valid.apiErrorResponse(this.error);
        }
      );
  }

  reset() {
    this.formFields = this.valid.resetFormFields(this.formFields);
    this.formFields[0].value = '0';
    this.formFields[1].value = '';
  }
}
