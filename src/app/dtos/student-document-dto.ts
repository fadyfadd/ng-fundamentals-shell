import { StudentDto } from "./student-dto";

export class StudentDocumentDto {
    public id?: number;
    public documentName?: string;
    public documentUrl?: string;
    public uploadedAt?: Date;
    public studentId?: number;   
    student?: StudentDto;
}


 