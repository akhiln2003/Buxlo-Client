export enum CommonApiEndPoints {
  changePassword = "/auth/common/changepassword",
  countactUs = "/user/common/contactus",
  sendMessage = "/chat/common/createmessage",
  fetchMessages = "/chat/common/fetchMessages",
  fetchMessageFromS3 = "/chat/common/fetchmessagefroms3",
  fetchWallet = "/payment/common/fetchwallet",
  createWallet = "/payment/common/createwallet",
  updateWalletName = "/payment/common/updatewalletname",
  fetchContacts = "/chat/common/fetchcontacts",
  sendNotification = "/notification/common/sendnotification",
  createNotification = "/notification/common/createnotification",
  fetchNotifications = "/notification/common/fetchnotifications",
  readNotifications = "/notification/common/readnotifications",
  deleteNotifications = "/notification/common/deletenotifications",
  fetchSubscriptionPlan = "/payment/common/fetchsubscriptionplan",
  createBookingCheckoutSession = "/payment/common/createbookingcheckoutsession",
  createSubscriptionCheckoutSession = "/payment/common/createsubscriptioncheckoutsession",
  fetchOnePaymet = "/payment/common/fetchonepaymet",
  updateSubscriptionPaymet = "payment/common/updatesubscriptionpaymet",
    updateBookingPaymet = "payment/common/updatesubbookingpaymet"

}
