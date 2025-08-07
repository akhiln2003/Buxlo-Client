export enum MentorApiEndPoints {
    signIn = '/auth/mentor/signin',
    signOut = '/auth/mentor/signout',
    signUp = '/auth/mentor/signup',
    verifyOtp = '/auth/mentor/verifyotp',
    resendOtp = '/auth/mentor/resendotp',
    forgotPassword = '/auth/mentor/forgotpassword',
    setNewPassword = '/auth/mentor/setnewpassword',
    googleAuth = '/auth/mentor/googleauth',
    fetchProfile = '/user/mentor/fetchprofile',
    fetchProfileImage = '/user/mentor/fetchprofileimage',
    deleteProfileImage = '/user/mentor/deleteprofileimage',
    updateProfile = '/user/mentor/updateprofile',
    updateProfileImage = '/user/mentor/updateprofileimage',
    kycVerification = '/user/mentor/verifyprofile',
    createOneSlot = '/booking/mentor/createoneslot',
    createRecurringSlot = '/booking/mentor/createrecurringslot',
    fetchSlots = '/booking/mentor/fetchslots',


}