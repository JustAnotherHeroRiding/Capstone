from django.urls import path


from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    
    path('api/get-csrf-token/', views.get_csrf_token, name='get_csrf_token'),
    
    path('check/login', views.check_login, name='check_login'),
    path('upload/profile/pic', views.upload_profile_pic, name='upload_profile_pic'),
    path('send/profile/comment/<int:profile_id>', views.send_profile_comment, name='send_profile_comment'),
    path('profile/comment/<int:profile_id>', views.get_profile_comments, name='get_profile_comments'),
    path('profile/messages', views.get_all_messages, name='get_messages'),
    path('profile/messages/user', views.get_all_users, name='user_messages'),
    path('profile/messages/conversation/<int:user_id>', views.get_message_history, name='message_history'),
    path('profile/follow/<int:user_id>', views.follow_user, name='follow_user'),
    path('profile/unfollow/<int:user_id>', views.unfollow_user, name='unfollow_user'),

    path('send/profile/message/<int:recipient_id>', views.send_message, name='send_message'),
    
    path('entries/get/all', views.get_all_entries, name='all_entries'),
    path('entries/<str:entry_type>/<int:entry_id>', views.get_single_entry, name='get_single_entry'),
    
    path('entries/add/<str:entry_type>', views.add_entry, name='add_entry'),
    path('entries/connection/<str:origin_type>/<int:origin_id>/<str:connection_type>', views.add_connections, name='new_connection'),
    path('entries/connection/delete/<str:origin_type>/<int:origin_id>/<str:connection_type>/<int:connection_id>', views.delete_connections, name='delete_connection'),
    path('entries/delete/<str:entry_type>/<int:entry_id>', views.delete_entry, name='delete_entry'),
    path('entries/add/comment/<str:entry_type>/<int:entry_id>', views.send_entry_comment, name='send_entry_comment'),
    
    path('wishlist/add/<int:gear_id>', views.add_to_wishlist, name='add_to_wishlist'),
    path('wishlist/remove/<int:gear_id>', views.remove_from_wishlist, name='remove_to_wishlist'),

    path('review/post/<str:entry_type>/<int:entry_id>', views.post_review, name='post_review'),
    path('review/get/all', views.get_all_reviews, name='get_all_reviews'),
    path('review/get/following/<int:user_id>', views.get_following_reviews, name='get_following_reviews'),
    
    path('search', views.search, name='search'),
    path('user/data/<int:user_id>', views.get_user_data, name='get_user_data'),
    path('user/delete/<int:user_id>', views.delete_user, name='delete_user'),
]