export interface RegistrationModel {
  studentName: string;
  email: string;
  phone: string;
  courseName: string;
}

export function initRegistrationModel(): RegistrationModel {
  return {
    studentName: '',
    email: '',
    phone: '',
    courseName: '',
  };
}
