export class EmployeeForm {
    id: number | null = null;
    firstName: string = "";
    lastName: string = "";
    email: string = "";
    address: string = "";
    phone: number = 0;
    newEmployee: boolean = true;
    birthday: Date = new Date();
    data: string = "";

    constructor(data?: Partial<EmployeeForm>) {
        if (data) {
          Object.assign(this, data);
        }
      }
}
