const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const auth_endpoints = {
    LOGIN_API: BASE_URL + '/auth/sign-in',
    SIGNUP_API: BASE_URL + '/auth/sign-up',
    SENDOTP_API: BASE_URL + '/auth/send-otp',
    GOOGLE_AUTH_API: BASE_URL + '/auth/google-auth',
    CHANGE_PASSWORD_API: BASE_URL + '/auth/change-password',
}

export const blog_endpoints = {
    CREATE_BLOG_API: BASE_URL + '/blog/create-blog',
    FETCH_LINK_DATA_API: BASE_URL + '/blog/fetch-link-data',
    UPLOAD_BY_FILE_API: BASE_URL + '/blog/upload-by-file',
    UPLOAD_BY_URL_API: BASE_URL + '/blog/upload-by-url',
    CREATE_DRAFT_BLOG_API: BASE_URL + '/blog/create-draft-blog',
    FETCH_BLOGS_API: BASE_URL + '/blog/fetch-blogs',
    FETCH_TRENDING_BLOGS_API: BASE_URL + '/blog/fetch-trending-blogs',
    FETCH_BLOGS_BY_CATEGORY_API: BASE_URL + '/blog/fetch-blog-by-category',
    SEARCH_BLOG_BY_QUERY_API: BASE_URL + '/blog/search-blog-by-query',
    FETCH_BLOG_DETAILS_API: BASE_URL + '/blog/fetch-blog-details',
    FETCH_SIMILAR_BLOGS_API: BASE_URL + '/blog/fetch-similar-blogs',
    LIKE_BLOG_API: BASE_URL + '/blog/like-blog',
}

export const user_endpoints = {
    SEARCH_USER_API: BASE_URL + '/user/search-user',
    SEARCH_USER_DETAILS_API: BASE_URL + '/user/get-user-details',
    CHECK_IS_BLOG_LIKED_API: BASE_URL + '/user/check-is-blog-liked',
    UPLOAD_PROFILE_IMAGE_API: BASE_URL + '/user/upload-profile-image',
    UPDATE_USER_DETAILS_API: BASE_URL + '/user/update-user-details',
    FETCH_USER_BLOGS: BASE_URL + '/user/fetch-user-blogs'
}

export const comment_endpoints = {
    ADD_COMMENT_API: BASE_URL + '/comment/add-comment',
    FETCH_PARENT_COMMENTS: BASE_URL + '/comment/fetch-parent-comments',
    FETCH_REPLY_COMMENTS: BASE_URL + '/comment/fetch-reply-comments',
}

export const notification_endpoints = {
    FETCH_NOTIFICATION_COUNT: BASE_URL + '/notification/fetch-notifications-count',
    FETCH_NOTIFICATIONS: BASE_URL + '/notification/fetch-notifications',
    DELETE_NOTIFICATION: BASE_URL + '/notification/delete-notification',
}