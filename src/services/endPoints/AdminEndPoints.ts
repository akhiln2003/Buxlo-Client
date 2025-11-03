export enum AdminApiEndPoints {
  signIn = "/auth/admin/signin",
  signOut = "/auth/admin/signout",
  fetchUsers = "/auth/admin/profile/fetchusers",
  fetchMentors = "/auth/admin/profile/fetchmentor",
  blockandunblock = "/auth/admin/profile/blockandunblock",
  createTrustedUs = "/adv/admin/createtrustedus",
  createAdv = "/adv/admin/createadv",
  fetchTrustedUsData = "/adv/admin/fetchtrustedus",
  fetchAdvData = "/adv/admin/fetchadv",
  fetchTrustedUsImage = "/adv/admin/fetchtrustedusimage",
  fetchAdvImage = "/adv/admin/fetchadvimage",
  deleteTrustedUsImage = "/adv/admin/deletetrustedusimage",
  deleteAdvImage = "/adv/admin/deleteadvimage",
  editAdv = "/adv/admin/editadv",
  updateSubscriptionPlan = "/payment/admin/updatesubscriptionplan",
  addSubscriptionPlan = "/payment/admin/addsubscriptionplan",
  deleteSubscriptionPlan = "/payment/admin/deletesubscriptionplan",
  fetchVerifyProfileData = "/user/admin/fetchverifyprofiledata",
  fethAadhaarImages = "/user/admin/fetchaadhaarimages",
  verifyprofile = "/user/admin/verifyprofile",
  fetchUserSummery = "/user/admin/fetchusersummery",
  fetchMentorSummery = "/user/admin/fetchmentorsummery",
  fetchIncomSummery = "/payment/admin/fetchincomsummery"


}
