import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpProviderService } from '../service/http-provider.service';
import { EmployeeForm } from '../model/employeeForm.model';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  addEmployeeForm: EmployeeForm = new EmployeeForm();

  @ViewChild("employeeForm")
  employeeForm!: NgForm;

  isSubmitted: boolean = false;

  isUnderage: boolean = false;

  maxDate: string = '';

  constructor(private router: Router, private httpProvider: HttpProviderService, private toastr: ToastrService) {
    this.setMaxDate();
  }

  ngOnInit(): void {
  }

  AddEmployee(isValid: any) {
    this.isSubmitted = true;
    if (isValid) {
      var data = Object.values(this.addEmployeeForm).filter(valor => valor !== null).join('|');
      this.addEmployeeForm.data = data;
      this.httpProvider.saveEmployee(this.addEmployeeForm).subscribe(async data => {
        if (data != null && data.body != null) {
          if (data != null && data.body != null) {
            var resultData = data.body;
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
    if (this.addEmployeeForm.birthday) {
      const birthDate = new Date(this.addEmployeeForm.birthday);
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

  validateTextOnly(event: KeyboardEvent) {
    const charCode = event.key;
    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(charCode)) {
      event.preventDefault();
    }
  }

}
