import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Gender } from 'src/app/models/ui-models/gender.model';
import { Student } from 'src/app/models/ui-models/students.model';
import { GendersService } from 'src/app/services/genders.service';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit{

  studentId : string | null | undefined;
  student: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    mobile: 0,
    email: '',
    profileImageUrl: '',
    genderId: '',
    gender: {
      id: '',
      description: ''
    },
    address: {
      id: '',
      physicalAddress: '',
      postalAddress: ''
    }
  }
  genderList: Gender[] = [];

  constructor(private readonly studentService: StudentService,
    private readonly route: ActivatedRoute,
    private readonly genderService: GendersService,
    private snackbar: MatSnackBar) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => {
        this.studentId = params.get('id');

        if(this.studentId) {
          this.studentService.getStudent(this.studentId).subscribe({
            next: (successResponse) => {
              this.student = successResponse;
            },
            error: (errorResponse) => {
              console.log(errorResponse);
            }
          });

          this.genderService.getGenders().subscribe({
            next: (successResponse) => {
              this.genderList = successResponse;
            },
            error: (errorResponse) => {
              console.log(errorResponse);
            }
          })
        }
      }
    );
  }

  onUpdate(): void {
    //update student using student service
    this.studentService.updateStudent(this.student.id,this.student)
    .subscribe({
      next: (successResponse) => {
              this.snackbar.open("Student Details Updated!", undefined, {
                duration: 3000
              })
            },
            error: (errorResponse) => {
              console.log(errorResponse);
            }
    });
  }
}
