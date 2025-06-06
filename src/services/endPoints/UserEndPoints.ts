export enum UserApiEndPoints {
    signIn = '/auth/user/signin',
    signOut = '/auth/user/signout',
    signUp = '/auth/user/signup',
    verifyOtp = '/auth/user/verifyotp',
    resendOtp = '/auth/user/resendotp',
    forgotPassword = '/auth/user/forgotpassword',
    setNewPassword = '/auth/user/setnewpassword',
    googleAuth = '/auth/user/googleauth',
    tokenGen = '/auth/user/refreshtoken',
    fetchProfile = '/user/user/fetchprofile',
    fetchProfileImage = '/user/user/fetchprofileimage',
    deleteProfileImage = '/user/user/deleteprofileimage',
    updateProfile = '/user/user/updateprofile',
    createlinktoken = '/payment/user/createlinktoken',
    exchangePublicToken = '/payment/user/exchangepublictoken',
    fetchMentorsList = '/user/user/fetchmentors',
    connectMentor = '/chat/user/connectmentor',
    fetchContacts = '/chat/user/fetchcontacts',
    moneyCategorize = '/payment/user/moneycategorize',
    fetchmoneycategorize = '/payment/user/fetchmoneycategorize',
    }