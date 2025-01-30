export enum AdminApiEndPoints {
    signIn = '/auth/admin/signin',
    signOut = '/auth/admin/signout',
    fetchUsers = '/auth/admin/profile/fetchusers',
    fetchMentors = '/auth/admin/profile/fetchmentor',
    blockandunblock = '/auth/admin/profile/blockandunblock',
    createTrustedUs = '/user/admin/createtrustedus',
    createAdv = '/user/admin/createadv',
    fetchTrustedUsData = '/user/admin/fetchtrustedus',
    fetchAdvData = '/user/admin/fetchadv',
    fetchTrustedUsImage = '/user/admin/fetchtrustedusimage',
    fetchAdvImage = '/user/admin/fetchadvimage',
    deleteTrustedUsImage = '/user/admin/deletetrustedusimage',
    deleteAdvImage = '/user/admin/deleteadvimage',
    editAdv = '/user/admin/editadv',
    updateSubscriptionPlan = '/payment/admin/updatesubscriptionplan',
    fetchSubscriptionPlan = '/payment/admin/fetchsubscriptionplan'


}