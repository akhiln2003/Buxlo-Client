// userApi -- create new user query parametir
export interface INewUserData {
  email: string;
  name: string;
  password: string;
}

// userApi -- verify otp query parametir
export interface IVerifyOtpData {
  otp: string;
  email: string;
}

// userApi -- resend otp query parametir
export interface IResendOtpData {
  email: string;
  name: string;
}

//  userApi -- signIn query parametir
export interface ISignInData {
  email: string;
  password: string;
}

// userApi -- contact us parametir
export interface IContactUsData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
