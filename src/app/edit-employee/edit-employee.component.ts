import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpProviderService } from '../service/http-provider.service';
import { EmployeeForm } from '../model/employeeForm.model';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent implements OnInit {
  editEmployeeForm: EmployeeForm = new EmployeeForm();

  @ViewChild("employeeForm")
  employeeForm!: NgForm;

  isSubmitted: boolean = false;
  employeeId: any;
  isUnderage: boolean = false;
  showMessage: boolean = false;
  showBotton: boolean = true;

  maxDate: string = '';
  originalData: string = '';

  constructor(private toastr: ToastrService, private route: ActivatedRoute, private router: Router,
    private httpProvider: HttpProviderService) {
      this.setMaxDate();
    }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.params['employeeId'];
    this.getEmployeeDetailById();
    this.originalData = this.editEmployeeForm.data;
  }

  getEmployeeDetailById() {
    this.httpProvider.getEmployeeDetailById(this.employeeId).subscribe((data: any) => {
      if (data != null && data.body != null) {
        var resultData = data.body;
        if (resultData) {
          this.editEmployeeForm.id = resultData.id;
          this.editEmployeeForm.firstName = resultData.firstName;
          this.editEmployeeForm.lastName = resultData.lastName;
          this.editEmployeeForm.email = resultData.email;
          this.editEmployeeForm.address = resultData.address;
          this.editEmployeeForm.phone = resultData.phone;
          this.editEmployeeForm.birthday = resultData.birthday;
          this.editEmployeeForm.data = resultData.data;

        }
      }
    },
      (error: any) => { });
  }

  EditEmployee(isValid: any) {
    this.isSubmitted = true;
    if (isValid) {
      this.editEmployeeForm.data = "";
      var data = Object.values(this.editEmployeeForm).filter(valor => (valor !== null && valor !== "")).join('|');
      this.editEmployeeForm.data = data;
      this.httpProvider.saveEmployee(this.editEmployeeForm).subscribe(async data => {
        if (data != null && data.body != null) {
          var resultData = data.body;
          if (resultData != null && resultData.isSuccess) {
            if (resultData != null && resultData.isSuccess) {
              this.toastr.success(resultData.message);
              setTimeout(() => {
                this.router.navigate(['/Home']);
              }, 500);
            }
          }
        }
      },
        async error => {
          this.toastr.error(error.message);
          setTimeout(() => {
            this.router.navigate(['/Home']);
          }, 500);
        });
    }
  }
  setMaxDate() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    this.maxDate = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }

  validateAge() {
    if (this.editEmployeeForm.birthday) {
      const birthDate = new Date(this.editEmployeeForm.birthday);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();

      // Ajustar edad si el mes o día de nacimiento aún no ha llegado este año
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        this.isUnderage = age - 1 < 18;
      } else {
        this.isUnderage = age < 18;
      }
    }
  }

  detectedChanges() {
    if (this.editEmployeeForm.data !== this.originalData) {
      this.showMessage = true;
      this.showBotton = false;
    } else {
      this.showMessage = false;
      this.showBotton = true;
    }
  }
}
