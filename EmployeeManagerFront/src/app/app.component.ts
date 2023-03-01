import { HttpErrorResponse, HttpResponse  } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public employees:Employee[] = [];
  public editEmployee:Employee | null;
  public deleteEmployee:Employee | null;

  constructor (private employeeService: EmployeeService){}

  ngOnInit(): void {
      this.getEmployees();
  }

  public getEmployees(): void {
    console.log("Teste");
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
        console.log(this.employees);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddEmployee(addForm: NgForm): void{
    document.getElementById("add-employee-form").click();
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) =>{
        console.log(response);
        this.getEmployees();
        addForm.reset();
      },
      (e: HttpErrorResponse)=>{
        alert(e.message)
      }
    )
  }

  public onUpdateEmployee(employee: Employee): void{
    document.getElementById("add-employee-form").click();
    this.employeeService.addEmployee(employee).subscribe(
      (response: Employee) =>{
        console.log(response);
        this.getEmployees();
      },
      (e: HttpErrorResponse)=>{
        alert(e.message)
      }
    )
  }

  public onDeleteEmployee(employeeId: number): void{
    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response: void) =>{
        this.getEmployees();
      },
      (e: HttpErrorResponse)=>{
        alert(e.message)
      }
    )
  }

  public searchEmployees(key: string): void{
    //Cria uma constante array de funcionários
    const results: Employee[] = [];
    //Percorre o array de funcionários e valida se tal letra contém em um nome, email etc.
    for(const employee of this.employees){
      //Passa tudo para minúsculo
      if(employee.name?.toLowerCase().indexOf(key.toLowerCase()) != -1 
      || employee.email?.toLowerCase().indexOf(key.toLowerCase()) != -1
      || employee.phone?.toLowerCase().indexOf(key.toLowerCase()) != -1
      || employee.jobTitle?.toLowerCase().indexOf(key.toLowerCase()) != -1){
        //Adiciona os funcionários com esse nome na constante
        results.push(employee)
      }
    }
    //Armazena nos funcionários o resultado
    this.employees = results;
    //Se o resultado for = a 0 ou a key for vazia chama o método pra carregar todos os employees
    if(results.length === 0 || !key){
      this.getEmployees();
    }
  }

  public onOpenModal(employee: Employee | null, mode: string): void{
    const container = document.getElementById("main-container");
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle','modal');
    if(mode === 'add'){
      button.setAttribute('data-target', `#addEmployeeModal`)
    }
    if(mode === 'update'){
      this.editEmployee = employee;
      button.setAttribute('data-target', `#updateEmployeeModal`)
    }
    if(mode === 'delete'){
      this.deleteEmployee = employee;
      button.setAttribute('data-target', `#deleteEmployeeModal`)
    }
    container?.append(button);
    button.click();
  }
}