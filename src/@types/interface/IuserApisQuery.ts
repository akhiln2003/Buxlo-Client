// userApi -- create new user query parametir 
export interface InewUserData {
    email: string ,
    name: string,
    password: string
}

// userApi -- verify otp query parametir 
export interface IverifyOtpData{
    otp: string,
    email: string
}

// userApi -- resend otp query parametir 
export interface IresendOtpData{
    email: string,
    name: string
}


//  userApi -- signIn query parametir
export interface IsignInData{
    email: string,
    password: string
}



// userApi -- 