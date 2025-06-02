import { Component } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BackendService } from '../../_services/backend.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-upload-network-form',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './upload-network-form.component.html',
  styleUrl: './upload-network-form.component.css'
})
export class UploadNetworkFormComponent {

  uploadNetworkForm: any = new FormGroup({
      name: new FormControl('', [Validators.required]),
      file: new FormControl(null, [Validators.required])
    });


  constructor(private backend: BackendService,
    private dialogRef: MatDialogRef<UploadNetworkFormComponent>,
    private toastr: ToastrService) {}

  cancel() {
    this.uploadNetworkForm.reset();
    this.dialogRef.close();
  }

  onSubmit() {
    console.log(this.uploadNetworkForm.value);

    if (this.uploadNetworkForm.valid) {
      const formData = new FormData();
      formData.append('name', this.uploadNetworkForm.get('name').value);
      formData.append('file', this.uploadNetworkForm.get('file').value);

      this.backend.uploadModel(formData)
        .then(response => {
          this.toastr.success('Upload successful');
          this.dialogRef.close();
        })
        .catch(error => {
          this.toastr.error(error.error, 'Upload failed');
          console.log('Upload failed:', error);
        });
    }
  }

  onFilePicked(event: Event) {

    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0]; // Here we use only the first file (single file)
    // console.log(file);
    if (file) {
      this.uploadNetworkForm.patchValue({ file: file });
    }
    this.uploadNetworkForm.patchValue({ file: file});
  }

}