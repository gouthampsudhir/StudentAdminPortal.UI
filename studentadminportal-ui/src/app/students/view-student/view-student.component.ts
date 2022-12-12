import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
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

  @ViewChild('studentDetailsForm') studentDetailsForm?: NgForm;

  header: string = '';

  isNewStudent: boolean = true;

  genderList: Gender[] = [];

  displayProfileImageUrl: string = '';

  constructor(private readonly studentService: StudentService,
    private readonly route: ActivatedRoute,
    private readonly genderService: GendersService,
    private snackbar: MatSnackBar,
    private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => {
        this.studentId = params.get('id');
        //check if studentId is defined
        if(this.studentId) {
          //check if studentId == add
          if(this.studentId.toLowerCase() === 'add') {
            //studentId is add i.e. new student
            this.isNewStudent = true;
            this.header = 'Add New Student';
            //setting profile image
            this.setImage();
          } else {
            //studentId not add i.e. existing student
            this.isNewStudent = false;
            this.header = 'Edit Student';
            this.studentService.getStudent(this.studentId).subscribe({
              next: (successResponse) => {
                this.student = successResponse;
                //setting profile image
                this.setImage();
              },
              error: (errorResponse) => {
                console.log(errorResponse);
              }
            });
          }
          //getting genderList for the dropdown
          this.genderService.getGenders().subscribe({
            next: (successResponse) => {
              this.genderList = successResponse;
            },
            error: (errorResponse) => {
              console.log(errorResponse);
            }
          });
        }
      }
    );
  }

  onUpdate(): void {
    //The form is checked if it is valid
    if(this.studentDetailsForm?.form.valid) {
      //update student using student service
      this.studentService.updateStudent(this.student.id,this.student)
      .subscribe({
        next: (successResponse) => {
              this.snackbar.open("Student Details Updated!", undefined, {
                duration: 2000
              });

              setTimeout(() => {
                this.router.navigateByUrl('students');
              }, 10);
            },
        error: (errorResponse) => {
              console.log(errorResponse);
            }
      });
    }

  }

  onDelete(): void {
    //delete using student service
    this.studentService.deleteStudent(this.student.id)
    .subscribe({
      next: (successResponse) => {
        this.snackbar.open('Student Deleted Successfully!', undefined, {
          duration: 2000
        });

        setTimeout(() => {
          this.router.navigateByUrl('students');
        }, 2000);
      },
      error: (errorResponse) => {
        console.log(errorResponse);
      }
    });
  }

  onAdd(): void {
    if(this.studentDetailsForm?.form.valid) {
      this.studentService.addStudent(this.student)
      .subscribe({
        next: (successResponse) => {

          this.snackbar.open('Student Added Successfully!', undefined, {
            duration: 2000
          });

          setTimeout(() => {
            this.router.navigateByUrl('students');
          }, 2000);

        },
        error: (errorResponse) => {
          console.log(errorResponse);
        }
      });
    }
  }

  onUploadImage(event: any): void {
    if(this.studentId) {
      const file: File = event.target.files[0];
      this.studentService.uploadImage(this.studentId, file)
      .subscribe({
        next: (successResponse) => {
          this.student.profileImageUrl = successResponse;
          this.setImage();
          this.snackbar.open('Profile Image Added!', undefined, {
            duration: 1500
          });
        },
        error: (errorResponse) => {
          console.log(errorResponse);
        }
      });
    }
  }

  private setImage(): void {
    if(this.student.profileImageUrl) {
      //fetch
      this.displayProfileImageUrl = this.studentService.getServerRelativePath(this.student.profileImageUrl);
    } else {
      this.displayProfileImageUrl = '/assets/images/DefaultProfileImage.jpg';
    }
  }
}
